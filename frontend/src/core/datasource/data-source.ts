import "reflect-metadata";
import { DataSource, DefaultNamingStrategy } from "typeorm";
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
      synchronize: false,
      logging: ["error", "query"],
      entities: ENTITIES,
      namingStrategy: new DefaultNamingStrategy(),
    });

    try {
      await dataSource.initialize();
      initialized = true;
      console.log("Data Source initialized");
    } catch (error) {
      console.error("Data Source initialization error:", error);
      throw error;
    }
  }
  return dataSource;
};
