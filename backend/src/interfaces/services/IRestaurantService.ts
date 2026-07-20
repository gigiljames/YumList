import { restaurantDTO, restaurantQueryDTO, restaurantListResponseDTO } from "../../dto/restaurant";
import { IRestaurant } from "../../models/restaurantModel";

export interface IRestaurantService {
  createRestaurant(data: restaurantDTO): Promise<IRestaurant>;
  updateRestaurant(data: restaurantDTO): Promise<IRestaurant | null>;
  deleteRestaurant(id: string): Promise<IRestaurant | null>;
  viewRestaurant(id: string): Promise<IRestaurant | null>;
  listRestaurants(data: restaurantQueryDTO): Promise<restaurantListResponseDTO>;
}
