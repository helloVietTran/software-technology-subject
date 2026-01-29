import mysql from "mysql2/promise";
import Logger from "../common/logger";
import { config } from "./config";

export const mysqlPool = mysql.createPool({
  uri: config.db.uri,
  connectionLimit: 10,
});

const connectMySQL = async () => {
  try {
    await mysqlPool.getConnection();
    console.log("MySQL connected successfully");
  } catch (err) {
    Logger.error("MySQL connection failed");
    console.error(err);
    process.exit(1);
  }
};

export default connectMySQL;
