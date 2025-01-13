import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'orders',
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(userId, userSocketIds);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      const updatedSocketIds = userSocketIds.filter((id) => id !== client.id);
      if (updatedSocketIds.length) {
        this.userSockets.set(userId, updatedSocketIds);
      } else {
        this.userSockets.delete(userId);
      }
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribeToOrder')
  handleSubscribeToOrder(client: Socket, orderId: string) {
    client.join(`order_${orderId}`);
    return { event: 'subscribed', data: { orderId } };
  }

  emitOrderStatusUpdate(orderId: string, status: string, additionalData?: any) {
    this.server.to(`order_${orderId}`).emit('orderStatusUpdated', {
      orderId,
      status,
      ...additionalData,
    });
  }

  emitOrderNotification(userId: string, notification: any) {
    const userSocketIds = this.userSockets.get(userId);
    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('orderNotification', notification);
      });
    }
  }
}
