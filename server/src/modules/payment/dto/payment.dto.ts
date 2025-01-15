import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  callbackUrl?: string;
}

export class VerifyPaymentDto {
  @ApiProperty()
  @IsString()
  reference: string;
}

export class RefundPaymentDto {
  @ApiProperty()
  @IsUUID()
  paymentId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    channel: string;
    paid_at: string;
    metadata: any;
  };
}