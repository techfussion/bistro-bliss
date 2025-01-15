import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as QRCode from 'qrcode';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;
  private readonly baseUrl: string = 'https://api.paystack.co';

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initializeTransaction(email: string, amount: number, metadata: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert to kobo
          metadata,
        },
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to initialize Paystack transaction: ${error.message}`);
      throw error;
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to verify Paystack transaction: ${error.message}`);
      throw error;
    }
  }

  async initiateRefund(transactionReference: string, amount?: number) {
    try {
      const payload: any = {
        transaction: transactionReference,
      };

      if (amount) {
        payload.amount = Math.round(amount * 100); // Convert to kobo
      }

      const response = await axios.post(
        `${this.baseUrl}/refund`,
        payload,
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to initiate Paystack refund: ${error.message}`);
      throw error;
    }
  }

  async verifyRefund(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/refund/${reference}`,
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to verify Paystack refund: ${error.message}`);
      throw error;
    }
  }

  async generateQRCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url);
    } catch (error) {
      this.logger.error(`Failed to generate QR code: ${error.message}`);
      throw error;
    }
  }
}