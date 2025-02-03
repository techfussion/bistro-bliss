import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/user.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { PaymentsModule } from './modules/payment/payment.module';
import { AddressModule } from './modules/address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    MenuModule,
    OrderModule,
    ReservationModule,
    PaymentsModule,
    AddressModule,
  ],
})
export class AppModule {}
