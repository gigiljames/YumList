import express from "express";
import { RestaurantRoutes } from "./routes/restaurantRoutes";
import { env } from "./config/envConfig";
import { logger } from "./utils/logger";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import "./config/dbConfig";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(loggerMiddleware);

const restaurantRoutes = new RestaurantRoutes();
app.use("/", restaurantRoutes.router);

app.use(errorHandlerMiddleware);

app.listen(env.PORT, () => {
  logger.info(`Server running at PORT ${env.PORT}`);
});
