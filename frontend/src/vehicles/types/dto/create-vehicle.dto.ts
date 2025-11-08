import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateVehicleDto {
  @IsNotEmpty({ message: "Make is required" })
  make: string;

  @IsNotEmpty({ message: "Model is required" })
  model: string;

  trim: string;

  @IsNotEmpty({ message: "Mileage is required" })
  @IsNumber(undefined, { message: "Mileage must be number" })
  mileage: number;
}
