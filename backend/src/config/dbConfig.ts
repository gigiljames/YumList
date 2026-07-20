import { Sequelize } from "sequelize";
import { logger } from "../utils/logger";
import { MESSAGES } from "../constants/messages";
import { env } from "./envConfig";

const getSequelizeInstance = () => {
  if (env.MYSQL_URL) {
    return new Sequelize(env.MYSQL_URL, {
      dialect: "mysql",
      logging: false,
    });
  }

  return new Sequelize(env.MYSQL_DB_NAME, env.MYSQL_DB_USER, env.MYSQL_DB_PASSWORD, {
    host: env.MYSQL_DB_HOST,
    port: env.MYSQL_DB_PORT,
    dialect: "mysql",
    logging: false,
  });
};

export const sequelize = getSequelizeInstance();

sequelize
  .authenticate()
  .then(() => {
    logger.info(MESSAGES.DATABASE_CONNECTED);
  })
  .catch((error) => {
    logger.error(MESSAGES.DATABASE_CONNECTION_ERROR);
    logger.error(error);
  });
