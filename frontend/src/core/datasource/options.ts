import { DataSourceOptions, DefaultNamingStrategy } from "typeorm";
import { ENTITIES } from "@/entities";

export function buildDataSourceOptions(): DataSourceOptions {
  return {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: process.env.REQUIRE_SSL === "true",
    synchronize: false,
    logging: ["error", "query"],
    entities: ENTITIES,
    namingStrategy: new DefaultNamingStrategy(),
  };
}
