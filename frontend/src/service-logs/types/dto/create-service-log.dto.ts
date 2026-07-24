import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ServiceLogType } from "@/types/service-logs";

export class CreateServiceLogDto {
  @IsOptional()
  @IsNumber(undefined, { message: "Mileage must be a number" })
  mileage?: number;

  @IsNotEmpty({ message: "Service type is required" })
  @IsEnum(ServiceLogType, { message: "Select a valid service type" })
  serviceType: ServiceLogType;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber(undefined, { message: "Repair cost must be a number" })
  repairCost?: number;
}
