import "reflect-metadata";
import { DataSource } from "typeorm";
import { buildDataSourceOptions } from "./options";

let initialized = false;
let dataSource: DataSource;

export const getDataSource = async () => {
  if (!initialized) {
    dataSource = new DataSource(buildDataSourceOptions());

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
