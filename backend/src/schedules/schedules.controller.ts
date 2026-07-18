import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { QueryAvailabilityDto } from './dto/query-availability.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleStatus } from './schedule.entity';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.schedulesService.create(createScheduleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Get('availability')
  async findAvailability(@Query() query: QueryAvailabilityDto) {
    return this.schedulesService.findAvailability(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Schedule> {
    return this.schedulesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async setStatus(@Param('id') id: string, @Body('status') status: ScheduleStatus): Promise<Schedule> {
    return this.schedulesService.setStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/active')
  async toggleActive(@Param('id') id: string, @Body('active') active: boolean): Promise<Schedule> {
    return this.schedulesService.toggleActive(id, active);
  }
}