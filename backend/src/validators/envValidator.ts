import z from "zod";
import { MESSAGES } from "../constants/messages";

export const envSchema = z.object({
  PORT: z.coerce
    .number({ message: MESSAGES.ENV.PORT_ERROR })
    .min(1000, { message: MESSAGES.ENV.PORT_ERROR })
    .max(65535, { message: MESSAGES.ENV.PORT_ERROR }),
  NODE_ENV: z.enum(["development", "production", "test"], {
    message: MESSAGES.ENV.NODE_ENV_ERROR,
  }),
  FRONTEND_URL: z.string({ message: MESSAGES.ENV.FRONTEND_URL_ERROR }),
  MYSQL_URL: z.string().optional(),
  MYSQL_DB_HOST: z.string().optional().default("localhost"),
  MYSQL_DB_NAME: z.string().optional().default("yumlist"),
  MYSQL_DB_USER: z.string().optional().default("root"),
  MYSQL_DB_PASSWORD: z.string().optional().default("password"),
  MYSQL_DB_PORT: z.coerce.number().optional().default(3306),
});
