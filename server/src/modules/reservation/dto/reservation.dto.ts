import { IsString, IsInt, IsISO8601, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  @IsISO8601()
  date: string;

  @ApiProperty()
  @IsISO8601()
  time: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(20)
  partySize: number;

  @ApiPropertyOptional()
  @IsString()
  notes?: string;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
