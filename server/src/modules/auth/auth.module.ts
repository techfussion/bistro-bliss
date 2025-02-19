import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

// import { Module } from "@nestjs/common";
// import { AuthController } from "./auth.controller";
// import { AuthService } from "./auth.service";
// import { JwtModule } from "@nestjs/jwt";
// import { JwtStrategy } from "./strategies/jwt.strategy";

// @Module({
//     imports: [JwtModule.register({})],
//     controllers: [AuthController],
//     providers: [AuthService, JwtStrategy],
// })

// export class AuthModule {}
