import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OverviewResponseDto } from './dto/overview.dto';

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: string;
  deliveryOrders: number;
  pickupOrders: number;
}

@Injectable()
export class OverviewService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats(): Promise<OverviewResponseDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      orderStats,
      totalUsers,
      activeMenuItems,
      todayReservations,
      recentOrders,
      recentReservations,
      recentPayments,
    ] = await Promise.all([
      // Get order statistics
      this.getOrderStats(),
      
      // Get total users (excluding admins)
      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),
      
      // Get active menu items
      this.prisma.menuItem.count({
        where: { isAvailable: true },
      }),
      
      // Get today's reservations
      this.prisma.reservation.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: 'CONFIRMED',
        },
      }),
      
      // Get recent orders
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      // Get recent reservations
      this.prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      
      // Get recent payments
      this.prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Combine and format recent activity
    const recentActivity = this.formatRecentActivity(
      recentOrders,
      recentReservations,
      recentPayments
    );

    return {
      orderStats,
      totalUsers,
      activeMenuItems,
      todayReservations,
      recentActivity,
    };
  }

  private async getOrderStats(): Promise<OrderStats> {
    const [orderCounts, revenue] = await Promise.all([
      // Get order counts by status and type
      this.prisma.order.groupBy({
        by: ['status', 'type'],
        _count: true,
      }),
      
      // Get total revenue from completed orders
      this.prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    const stats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: '0',
      deliveryOrders: 0,
      pickupOrders: 0,
    };

    orderCounts.forEach((count) => {
      stats.totalOrders += count._count;
      if (count.status === 'PENDING') stats.pendingOrders += count._count;
      if (count.status === 'COMPLETED') stats.completedOrders += count._count;
      if (count.type === 'DELIVERY') stats.deliveryOrders += count._count;
      if (count.type === 'PICKUP') stats.pickupOrders += count._count;
    });

    stats.totalRevenue = revenue._sum.total?.toString() || '0';

    return stats;
  }

  private formatRecentActivity(orders: any[], reservations: any[], payments: any[]) {
    const activity = [
      ...orders.map(order => ({
        id: order.id,
        type: 'ORDER' as const,
        description: `New order from ${order.user.firstName} ${order.user.lastName}`,
        timestamp: order.createdAt,
        status: order.status,
      })),
      ...reservations.map(reservation => ({
        id: reservation.id,
        type: 'RESERVATION' as const,
        description: `New reservation by ${reservation.user.firstName} ${reservation.user.lastName}`,
        timestamp: reservation.createdAt,
        status: reservation.status,
      })),
      ...payments.map(payment => ({
        id: payment.id,
        type: 'PAYMENT' as const,
        description: `Payment ${payment.status.toLowerCase()} for order`,
        timestamp: payment.createdAt,
        status: payment.status,
      })),
    ];

    return activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }
}