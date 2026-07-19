import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(UserRole.CLIENTE)
  @Post()
  async create(@Req() req: Request, @Body() createReservationDto: CreateReservationDto) {
    const user = req.user as { id: string };
    return this.reservationsService.create(user.id, createReservationDto);
  }

  @Roles(UserRole.CLIENTE)
  @Get('me')
  async findMine(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.reservationsService.findMine(user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Roles(UserRole.CLIENTE, UserRole.ADMIN)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string; role: UserRole };
    return this.reservationsService.cancel(id, user.id, user.role);
  }
}
