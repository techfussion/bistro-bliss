import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderGateway } from './order.gateway';
import { CreateOrderDto } from './dto/order.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderGateway: OrderGateway,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: string) {
    // Calculate order totals
    let subtotal: number = 0;
    const orderItems = [];

    // Fetch all menu items in one query
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: {
          in: dto.items.map((item) => item.menuItemId),
        },
      },
    });

    // Create order items and calculate subtotal
    for (const item of dto.items) {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes,
      });

      subtotal += Number(menuItem.price) * item.quantity;
    }

    // Calculate tax (assuming 10% tax rate)
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        type: dto.type,
        addressId: dto.addressId,
        specialNotes: dto.specialNotes,
        subtotal,
        tax,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Emit new order notification
    this.orderGateway.emitOrderNotification(userId, {
      type: 'NEW_ORDER',
      orderId: order.id,
      message: `Your order #${order.id} has been received`,
    });

    return order;
  }

  async getAllOrders(paginationDto: PaginationDto, user: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = user.role === Role.ADMIN ? {} : { userId: user.userId };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Check if user has access to this order
    if (user.role !== Role.ADMIN && order.userId !== user.userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    // const order = await this.getOrderById(id, { role: Role.ADMIN });

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
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
    });

    // Emit order status update
    this.orderGateway.emitOrderStatusUpdate(id, status);

    // Emit notification to user
    this.orderGateway.emitOrderNotification(updatedOrder.userId, {
      type: 'STATUS_UPDATE',
      orderId: id,
      status,
      message: `Your order #${id} status has been updated to ${status}`,
    });

    return updatedOrder;
  }
}
