import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from './dto/reservation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role, ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationService {
  private readonly MAX_PARTY_SIZE = 20;
  private readonly OPENING_HOUR = 11; // 11 AM
  private readonly CLOSING_HOUR = 22; // 10 PM
  private readonly TIME_SLOT_DURATION = 60; // 60 minutes
  private readonly MAX_TABLES_PER_SLOT = 15;

  constructor(private readonly prisma: PrismaService) {}

  async createReservation(dto: CreateReservationDto, userId: string) {
    // Validate party size
    if (dto.partySize > this.MAX_PARTY_SIZE) {
      throw new BadRequestException(
        `Maximum party size is ${this.MAX_PARTY_SIZE}`,
      );
    }

    // Check if time slot is available
    const isAvailable = await this.isTimeSlotAvailable(
      dto.date,
      dto.time,
      dto.partySize,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        'Selected time slot is not available. Please choose another time.',
      );
    }

    // Create reservation
    const reservation = await this.prisma.reservation.create({
      data: {
        userId,
        date: new Date(dto.date),
        time: new Date(dto.time),
        partySize: dto.partySize,
        notes: dto.notes,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return reservation;
  }

  async getAllReservations(paginationDto: PaginationDto, user: any) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = user.role === Role.ADMIN ? {} : { userId: user.userId };

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      data: reservations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReservationById(id: string, user: any) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    // Check if user has access to this reservation
    if (user.role !== Role.ADMIN && reservation.userId !== user.userId) {
      throw new ForbiddenException(
        'You do not have access to this reservation',
      );
    }

    return reservation;
  }

  async updateReservation(id: string, dto: UpdateReservationDto, user: any) {
    const reservation = await this.getReservationById(id, user);

    // Check if reservation is already confirmed
    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException(
        'Cannot update confirmed reservation. Please contact support.',
      );
    }

    // If changing date/time/party size, check availability
    if (dto.date || dto.time || dto.partySize) {
      const isAvailable = await this.isTimeSlotAvailable(
        dto.date || reservation.date.toISOString(),
        dto.time || reservation.time.toISOString(),
        dto.partySize || reservation.partySize,
        id, // Exclude current reservation from check
      );

      if (!isAvailable) {
        throw new BadRequestException(
          'Selected time slot is not available. Please choose another time.',
        );
      }
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        time: dto.time ? new Date(dto.time) : undefined,
        partySize: dto.partySize,
        notes: dto.notes,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async cancelReservation(id: string, user: any) {
    const reservation = await this.getReservationById(id, user);

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
      },
    });
  }

  async confirmReservation(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CONFIRMED,
      },
    });
  }

  async getAvailableTimeSlots(date: Date) {
    const availableSlots = [];
    const startTime = new Date(date);
    startTime.setHours(this.OPENING_HOUR, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(this.CLOSING_HOUR, 0, 0, 0);

    for (
      let time = startTime;
      time < endTime;
      time = new Date(time.getTime() + this.TIME_SLOT_DURATION * 60000)
    ) {
      const isAvailable = await this.isTimeSlotAvailable(
        date.toISOString(),
        time.toISOString(),
        1, // Check minimum party size
      );

      if (isAvailable) {
        availableSlots.push(time.toISOString());
      }
    }

    return availableSlots;
  }

  private async isTimeSlotAvailable(
    date: string,
    time: string,
    partySize: number,
    excludeReservationId?: string,
  ) {
    const reservationDateTime = new Date(time);
    const startTime = new Date(reservationDateTime.getTime() - 30 * 60000); // 30 minutes before
    const endTime = new Date(reservationDateTime.getTime() + 90 * 60000); // 90 minutes after

    // Count existing reservations in the time slot
    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        date: new Date(date),
        time: {
          gte: startTime,
          lte: endTime,
        },
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
        id: {
          not: excludeReservationId,
        },
      },
    });

    // Calculate total tables needed
    const totalTablesNeeded = existingReservations.reduce(
      (total, reservation) => total + Math.ceil(reservation.partySize / 4),
      Math.ceil(partySize / 4),
    );

    return totalTablesNeeded <= this.MAX_TABLES_PER_SLOT;
  }
}
