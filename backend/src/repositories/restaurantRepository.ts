import { Op, WhereOptions } from "sequelize";
import { sequelize } from "../config/dbConfig";
import { restaurantDTO, restaurantQueryDTO, restaurantListResponseDTO } from "../dto/restaurant";
import { IRestaurantRepository } from "../interfaces/repositories/IRestaurantRepository";
import { IRestaurant, Restaurant } from "../models/restaurantModel";

export class RestaurantRepository implements IRestaurantRepository {
  async createRestaurant(data: restaurantDTO): Promise<IRestaurant> {
    const restaurant = await Restaurant.create(data as Restaurant);
    return restaurant;
  }

  async updateRestaurant(data: restaurantDTO): Promise<IRestaurant | null> {
    if (!data.id) {
      return null;
    }
    const restaurant = await Restaurant.findByPk(data.id);
    if (!restaurant) {
      return null;
    }
    await restaurant.update(data);
    return restaurant;
  }

  async deleteRestaurant(id: string): Promise<IRestaurant | null> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return null;
    }
    const restaurant = await Restaurant.findByPk(numericId);
    if (!restaurant) {
      return null;
    }
    await restaurant.destroy();
    return restaurant;
  }

  async listRestaurants(data: restaurantQueryDTO): Promise<restaurantListResponseDTO> {
    const where: WhereOptions & Record<symbol, object> = {};

    if (data.name) {
      where.name = {
        [Op.like]: `%${data.name}%`,
      };
    }

    if (data.mode) {
      if (data.mode === "DINING") {
        where.mode = {
          [Op.in]: ["DINING", "BOTH"],
        };
      } else if (data.mode === "TAKEOUT") {
        where.mode = {
          [Op.in]: ["TAKEOUT", "BOTH"],
        };
      } else {
        where.mode = "BOTH";
      }
    }

    if (data.tags && data.tags.length > 0) {
      const tagConditions = data.tags.map((tag) =>
        sequelize.where(
          sequelize.fn(
            "JSON_CONTAINS",
            sequelize.col("tags"),
            JSON.stringify(tag),
          ),
          1,
        ),
      );
      where[Op.and] = tagConditions;
    }

    const limit = data.limit ? data.limit : undefined;
    const offset = (data.page && data.limit) ? (data.page - 1) * data.limit : undefined;

    const { rows, count } = await Restaurant.findAndCountAll({
      where,
      limit,
      offset
    });
    return { rows, count };
  }

  async viewRestaurant(id: string): Promise<IRestaurant | null> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return null;
    }
    const restaurant = await Restaurant.findByPk(numericId);
    return restaurant;
  }

  async findByName(name: string): Promise<IRestaurant | null> {
    const restaurant = await Restaurant.findOne({ where: { name } });
    return restaurant;
  }
}

