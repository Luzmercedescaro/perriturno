import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Reservation]),
		PetsModule,
		ServicesModule,
		UsersModule,
	],
	controllers: [ReservationsController],
	providers: [ReservationsService],
})
export class ReservationsModule {}
