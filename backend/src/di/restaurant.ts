import { RestaurantController } from "../controllers/restaurantController";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { RestaurantService } from "../services/restaurantService";

const restaurantRepository = new RestaurantRepository();

const restaurantService = new RestaurantService(restaurantRepository);

export const injectedRestaurantController = new RestaurantController(
  restaurantService,
);
