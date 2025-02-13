import { Controller, Get, UseGuards } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewResponseDto } from './dto/overview.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('overview')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  async getOverview(): Promise<OverviewResponseDto> {
    return this.overviewService.getOverviewStats();
  }
}