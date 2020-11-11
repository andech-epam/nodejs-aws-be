import { ClientConfig } from "pg";
import { env } from "../../env";

export const DB_CONNECTION_CONFIG: ClientConfig = {
  host: env.PG_HOST,
  port: Number(env.PG_PORT),
  database: env.PG_DATABASE,
  user: env.PG_USERNAME,
  password: env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
