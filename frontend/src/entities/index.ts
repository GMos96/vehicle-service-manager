import { User } from "./user/user.entity";
import { Vehicle } from "@/entities/vehicles/vehicle.entity";
import { Oil } from "@/entities/vehicles/oil.entity";
import { OilFilter } from "@/entities/vehicles/oil-filter.entity";
import { Tire } from "@/entities/vehicles/tire.entity";
import { ServiceLog } from "@/entities/service-log/service-log.entity";
import { VehicleAccess } from "@/entities/vehicle-access/vehicle-access.entity";
import { VehicleInvitation } from "@/entities/vehicle-invitation/vehicle-invitation.entity";

export const ENTITIES = [
  User,
  Vehicle,
  Oil,
  OilFilter,
  Tire,
  ServiceLog,
  VehicleAccess,
  VehicleInvitation,
];
