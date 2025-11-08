// frontend/src/core/datasource/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { ENTITIES } from "@/entities";

let initialized = false;
let dataSource: DataSource;

export const getDataSource = async () => {
  if (!initialized) {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: process.env.REQUIRE_SSL === "true",
      synchronize: true,
      logging: false,
      entities: ENTITIES,
      migrations: [],
      subscribers: [],
    });

    await dataSource.initialize();
    initialized = true;
  }
  return dataSource;
};
