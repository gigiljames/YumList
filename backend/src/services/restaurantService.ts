import { restaurantDTO, restaurantQueryDTO, restaurantListResponseDTO } from "../dto/restaurant";
import { IRestaurantRepository } from "../interfaces/repositories/IRestaurantRepository";
import { IRestaurantService } from "../interfaces/services/IRestaurantService";
import { IRestaurant } from "../models/restaurantModel";
import { CustomError } from "../shared/customError";
import { HTTPSTATUSCODES } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";

export class RestaurantService implements IRestaurantService {
  constructor(private _restaurantRepository: IRestaurantRepository) { }

  async createRestaurant(data: restaurantDTO): Promise<IRestaurant> {
    const existing = await this._restaurantRepository.findByName(data.name);
    if (existing) {
      throw new CustomError(HTTPSTATUSCODES.CONFLICT, MESSAGES.RESTAURANT.ALREADY_EXISTS);
    }
    const restaurant = await this._restaurantRepository.createRestaurant(data);
    return restaurant;
  }

  async updateRestaurant(data: restaurantDTO): Promise<IRestaurant | null> {
    const restaurant = await this._restaurantRepository.updateRestaurant(data);
    if (!restaurant) {
      throw new CustomError(HTTPSTATUSCODES.NOT_FOUND, MESSAGES.RESTAURANT.NOT_FOUND);
    }
    return restaurant;
  }

  async deleteRestaurant(id: string): Promise<IRestaurant | null> {
    const restaurant = await this._restaurantRepository.deleteRestaurant(id);
    if (!restaurant) {
      throw new CustomError(HTTPSTATUSCODES.NOT_FOUND, MESSAGES.RESTAURANT.NOT_FOUND);
    }
    return restaurant;
  }

  async listRestaurants(data: restaurantQueryDTO): Promise<restaurantListResponseDTO> {
    const restaurants = await this._restaurantRepository.listRestaurants(data);
    return restaurants;
  }

  async viewRestaurant(id: string): Promise<IRestaurant | null> {
    const restaurant = await this._restaurantRepository.viewRestaurant(id);
    if (!restaurant) {
      throw new CustomError(HTTPSTATUSCODES.NOT_FOUND, MESSAGES.RESTAURANT.NOT_FOUND);
    }
    return restaurant;
  }
}
