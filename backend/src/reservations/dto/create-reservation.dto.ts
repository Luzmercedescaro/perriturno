export class CreateReservationDto {
  petId!: string;
  serviceId!: string;
  scheduleId!: string;
  observations?: string;
}
