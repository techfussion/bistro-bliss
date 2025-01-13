import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from './dto/reservation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  async createReservation(@Body() dto: CreateReservationDto, @Req() req: any) {
    return this.reservationService.createReservation(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  async getAllReservations(
    @Query() paginationDto: PaginationDto,
    @Req() req: any,
  ) {
    return this.reservationService.getAllReservations(paginationDto, req.user);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots for a specific date' })
  async getAvailableSlots(@Query('date') date: string) {
    return this.reservationService.getAvailableTimeSlots(new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by id' })
  async getReservationById(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.getReservationById(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update reservation' })
  async updateReservation(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
    @Req() req: any,
  ) {
    return this.reservationService.updateReservation(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel reservation' })
  async cancelReservation(@Param('id') id: string, @Req() req: any) {
    return this.reservationService.cancelReservation(id, req.user);
  }

  @Put(':id/confirm')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Confirm reservation' })
  async confirmReservation(@Param('id') id: string) {
    return this.reservationService.confirmReservation(id);
  }
}
