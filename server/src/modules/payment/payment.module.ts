import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { PaymentsGateway } from './payment.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from './paystack.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaystackService,
    PaymentsGateway,
    PrismaService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}