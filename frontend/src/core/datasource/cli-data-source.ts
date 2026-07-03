import "dotenv/config";
import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { buildDataSourceOptions } from "./options";

const cliDataSource = new DataSource({
  ...buildDataSourceOptions(),
  migrations: [path.join(__dirname, "..", "..", "migrations", "*.{ts,js}")],
  migrationsTableName: "migrations",
});

export default cliDataSource;
