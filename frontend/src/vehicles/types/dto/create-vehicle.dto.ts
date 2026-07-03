import { IsNotEmpty, IsNumber, IsOptional, Length, Matches } from "class-validator";
import { VIN_REGEX } from "@/util/vin";

export class CreateVehicleDto {
  @IsNotEmpty({ message: "Make is required" })
  make: string;

  @IsNotEmpty({ message: "Model is required" })
  model: string;

  trim: string;

  @IsNotEmpty({ message: "Mileage is required" })
  @IsNumber(undefined, { message: "Mileage must be number" })
  mileage: number;

  @IsOptional()
  @Length(17, 17, { message: "VIN must be exactly 17 characters" })
  @Matches(VIN_REGEX, { message: "VIN contains invalid characters" })
  vin?: string;
}
