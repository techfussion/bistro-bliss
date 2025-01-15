import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from './paystack.service';
import { PaymentsGateway } from './payment.gateway';
import { CreatePaymentDto } from './dto/payment.dto';
import { Payment, PaymentStatus } from '@prisma/client';

interface WebhookPayload {
    event: string;
    data: {
        reference: string;
        status: string;
        metadata: {
        paymentId: string;
        orderId: string;
        };
    };
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly paystackService: PaystackService,
    private readonly paymentsGateway: PaymentsGateway,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Initialize payment in database
    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        status: 'PENDING',
        currency: 'NGN',
        provider: 'PAYSTACK',
      },
    });

    // Initialize Paystack transaction
    const paystackResponse = await this.paystackService.initializeTransaction(
      order.user.email,
      Number(order.total),
      {
        orderId: order.id,
        paymentId: payment.id,
      },
    );

    // Generate QR code
    const qrCodeUrl = await this.paystackService.generateQRCode(
      paystackResponse.data.authorization_url,
    );

    // Update payment with QR code and provider reference
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        qrCodeUrl,
        providerPaymentId: paystackResponse.data.reference,
        paymentAttempts: {
          create: {
            status: 'PENDING',
            providerReference: paystackResponse.data.reference,
          },
        },
      },
    });

    // Notify clients about new payment
    this.paymentsGateway.notifyPaymentUpdate(payment.id, 'PENDING');

    return updatedPayment;
  }

  async verifyPayment(reference: string): Promise<Payment> {
    const verificationResponse = await this.paystackService.verifyTransaction(reference);
    
    const payment = await this.prisma.payment.findFirst({
      where: { providerPaymentId: reference },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const newStatus = this.mapPaystackStatus(verificationResponse.data.status);
    
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paymentAttempts: {
          create: {
            status: newStatus,
            providerReference: reference,
            metadata: verificationResponse.data,
          },
        },
      },
    });

    this.paymentsGateway.notifyPaymentUpdate(payment.id, newStatus);
    
    return updatedPayment;
  }

  async handleWebhook(payload: WebhookPayload): Promise<void> {
    this.logger.log(`Received webhook: ${payload.event}`);

    // Create webhook event record
    const event = await this.prisma.webhookEvent.create({
      data: {
        paymentId: payload.data.metadata.paymentId,
        eventType: payload.event,
        payload: JSON.stringify(payload),
        processed: false,
      },
    });

    // Process the webhook event
    await this.processWebhookEvent(event);
  }

  async processWebhookEvent(event: any): Promise<void> {
    if (event.processed) {
      this.logger.log(`Event ${event.id} already processed`);
      return;
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: event.paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment not found for event ${event.id}`);
    }

    try {
      switch (event.eventType) {
        case 'charge.success':
          await this.handleSuccessfulPayment(payment, event);
          break;
        case 'charge.failed':
          await this.handleFailedPayment(payment, event);
          break;
        case 'transfer.success':
          await this.handleSuccessfulRefund(payment, event);
          break;
        case 'transfer.failed':
          await this.handleFailedRefund(payment, event);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${event.eventType}`);
      }

      // Mark event as processed
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });
    } catch (error) {
      this.logger.error(`Error processing webhook event: ${error.message}`);
      throw error;
    }
  }

  private async handleSuccessfulPayment(payment: Payment, event: any): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      });

      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' },
      });
    });

    this.paymentsGateway.notifyPaymentUpdate(payment.id, 'COMPLETED');
  }

  private async handleFailedPayment(payment: Payment, event: any): Promise<void> {
    const attempts = await this.prisma.paymentAttempt.count({
      where: { paymentId: payment.id },
    });

    if (attempts < this.maxRetries) {
      this.logger.log(`Scheduling retry for payment ${payment.id}. Attempt ${attempts + 1}/${this.maxRetries}`);
      
      // Schedule retry after delay
      setTimeout(() => this.retryPayment(payment.id), this.retryDelay);
      
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PENDING' },
      });
    } else {
      this.logger.log(`Payment ${payment.id} failed after ${attempts} attempts`);
      
      await this.prisma.$transaction(async (prisma) => {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });

        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'CANCELLED' },
        });
      });
    }

    this.paymentsGateway.notifyPaymentUpdate(payment.id, payment.status);
  }

  async retryPayment(paymentId: string): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: { include: { user: true } } },
    });

    if (!payment || payment.status !== 'PENDING') {
      this.logger.log(`Cannot retry payment ${paymentId}: Invalid status or not found`);
      return;
    }

    try {
      const paystackResponse = await this.paystackService.initializeTransaction(
        payment.order.user.email,
        Number(payment.amount),
        {
          orderId: payment.order.id,
          paymentId: payment.id,
          isRetry: true,
          retryCount: await this.prisma.paymentAttempt.count({
            where: { paymentId: payment.id },
          }),
        },
      );

      await this.prisma.paymentAttempt.create({
        data: {
          paymentId: payment.id,
          status: 'PENDING',
          providerReference: paystackResponse.data.reference,
        },
      });

      this.paymentsGateway.notifyPaymentUpdate(payment.id, 'PENDING');
    } catch (error) {
      this.logger.error(`Failed to retry payment ${paymentId}: ${error.message}`);
      await this.handleFailedPayment(payment, null);
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new Error('Can only refund completed payments');
    }

    const refundAmount = amount || Number(payment.amount);
    if (refundAmount > Number(payment.amount)) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    try {
      // Initialize refund with Paystack
      const refundResponse = await this.paystackService.initiateRefund(
        payment.providerPaymentId,
        refundAmount,
      );

      // Update payment status
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
          paymentAttempts: {
            create: {
              status: 'REFUNDED',
              providerReference: refundResponse.data.reference,
              metadata: refundResponse.data,
            },
          },
        },
      });

      this.paymentsGateway.notifyPaymentUpdate(payment.id, 'REFUNDED');
      return updatedPayment;
    } catch (error) {
      this.logger.error(`Failed to process refund for payment ${paymentId}: ${error.message}`);
      throw error;
    }
  }

  private async handleSuccessfulRefund(payment: Payment, event: any): Promise<void> {
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'REFUNDED',
        paymentAttempts: {
          create: {
            status: 'REFUNDED',
            providerReference: event.data.reference,
            metadata: event.data,
          },
        },
      },
    });

    this.paymentsGateway.notifyPaymentUpdate(payment.id, 'REFUNDED');
  }

  private async handleFailedRefund(payment: Payment, event: any): Promise<void> {
    // Log the failed refund attempt
    await this.prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        status: 'FAILED',
        providerReference: event.data.reference,
        errorMessage: 'Refund failed',
        metadata: event.data,
      },
    });

    this.logger.error(`Refund failed for payment ${payment.id}`);
  }

  async getPayment(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        paymentAttempts: true,
        order: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private mapPaystackStatus(paystackStatus: string): PaymentStatus {
    switch (paystackStatus.toLowerCase()) {
      case 'success':
        return 'COMPLETED';
      case 'failed':
        return 'FAILED';
      case 'pending':
        return 'PENDING';
      default:
        return 'PROCESSING';
    }
  }
}