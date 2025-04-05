import { CreateServiceLogDTO } from '../dto/create-service-log-dto';

export const ServiceLogEvent = {
  serviceLogCreated: 'serviceLogCreated',
} as const;

export type ServiceLogEvent = CreateServiceLogDTO;
