import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Req() req: Request, @Body() createPetDto: CreatePetDto) {
    const user = req.user as { id: string };
    return this.petsService.create(createPetDto, user.id);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.petsService.findAllByOwner(user.id);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    return this.petsService.findOneByOwner(id, user.id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    const user = req.user as { id: string };
    return this.petsService.update(id, user.id, updatePetDto);
  }
}
