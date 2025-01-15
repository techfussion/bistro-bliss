import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  import { PaymentStatus } from '@prisma/client';
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    namespace: 'payments',
  })
  export class PaymentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(PaymentsGateway.name);
    
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('join-payment')
    handleJoinPayment(client: Socket, paymentId: string) {
      client.join(`payment-${paymentId}`);
      this.logger.log(`Client ${client.id} joined payment room: ${paymentId}`);
    }
  
    @SubscribeMessage('leave-payment')
    handleLeavePayment(client: Socket, paymentId: string) {
      client.leave(`payment-${paymentId}`);
      this.logger.log(`Client ${client.id} left payment room: ${paymentId}`);
    }
  
    notifyPaymentUpdate(paymentId: string, status: PaymentStatus) {
      this.server.to(`payment-${paymentId}`).emit('payment-update', {
        paymentId,
        status,
        timestamp: new Date(),
      });
    }
  }