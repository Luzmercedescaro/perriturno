import { IsOptional, IsString } from 'class-validator';

export class QueryAgendaDto {
  @IsOptional()
  @IsString()
  scheduleDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;
}