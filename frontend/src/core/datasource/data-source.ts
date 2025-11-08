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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
