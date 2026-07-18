export class QueryAvailabilityDto {
  scheduleDate!: string;
  serviceId!: string;
  petSize!: string;
  startTime?: string;
  status?: string;
}