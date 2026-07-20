import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  scheduleDate!: string;

  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsString()
  @IsNotEmpty()
  petSize!: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  status?: string;
}