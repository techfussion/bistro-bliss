import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.orderService.createOrder(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders(@Query() paginationDto: PaginationDto, @Req() req: any) {
    return this.orderService.getAllOrders(paginationDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    return this.orderService.getOrderById(id, req.user);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, dto.status);
  }
}
