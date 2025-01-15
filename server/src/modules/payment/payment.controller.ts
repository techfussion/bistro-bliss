import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { PaymentsService } from './payment.service';
  import { CreatePaymentDto, VerifyPaymentDto, RefundPaymentDto } from './dto/payment.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { Payment } from '@prisma/client';
  
  @ApiTags('payments')
  @Controller('payments')
  @UseGuards(JwtAuthGuard)
  export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Initialize a new payment' })
    @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
    async createPayment(
      @Body(ValidationPipe) createPaymentDto: CreatePaymentDto,
    ): Promise<Payment> {
      return this.paymentsService.createPayment(createPaymentDto);
    }
  
    @Post('verify')
    @ApiOperation({ summary: 'Verify a payment' })
    async verifyPayment(
      @Body(ValidationPipe) verifyPaymentDto: VerifyPaymentDto,
    ): Promise<Payment> {
      return this.paymentsService.verifyPayment(verifyPaymentDto.reference);
    }
  
    @Post('refund')
    @ApiOperation({ summary: 'Refund a payment' })
    async refundPayment(
      @Body(ValidationPipe) refundPaymentDto: RefundPaymentDto,
    ): Promise<Payment> {
      return this.paymentsService.refundPayment(
        refundPaymentDto.paymentId,
        refundPaymentDto.amount,
      );
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get payment details' })
    async getPayment(@Param('id') id: string): Promise<Payment> {
      return this.paymentsService.getPayment(id);
    }
  
    // Webhook endpoint doesn't need auth guard
    @Post('webhook')
    async handleWebhook(@Body() payload: any) {
      return this.paymentsService.handleWebhook(payload);
    }
  }