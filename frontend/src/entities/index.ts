import { User } from "./user/user.entity";
import { Vehicle } from "@/entities/vehicles/vehicle.entity";
import { Oil } from "@/entities/vehicles/oil.entity";
import { OilFilter } from "@/entities/vehicles/oil-filter.entity";
import { Tire } from "@/entities/vehicles/tire.entity";
import { ServiceLog } from "@/entities/service-log/service-log.entity";

export const ENTITIES = [User, Vehicle, Oil, OilFilter, Tire, ServiceLog];
