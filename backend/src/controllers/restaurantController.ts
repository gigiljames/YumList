import { NextFunction, Request, Response } from "express";
import { IRestaurantService } from "../interfaces/services/IRestaurantService";
import { logger } from "../utils/logger";
import { HTTPResponseBuilder } from "../utils/httpResponseBuilder";
import { HTTPSTATUSCODES } from "../constants/httpStatusCodes";
import { MESSAGES } from "../constants/messages";
import {
  restaurantQuerySchema,
  restaurantSchema,
} from "../validators/restaurantValidator";
import { CustomError } from "../shared/customError";

export class RestaurantController {
  constructor(private _restaurantService: IRestaurantService) { }

  async listRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const query = restaurantQuerySchema.parse(req.query);
      const restaurants = await this._restaurantService.listRestaurants(query);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTPSTATUSCODES.OK,
        MESSAGES.RESTAURANT.FETCHED_RESTAURANTS,
        restaurants,
      );
    } catch (e) {
      logger.error("ERROR: List Restaurants");
      next(e);
    }
  }

  async viewRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id) {
        throw new CustomError(HTTPSTATUSCODES.BAD_REQUEST, MESSAGES.INVALID_ID);
      }
      const restaurant = await this._restaurantService.viewRestaurant(id);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTPSTATUSCODES.OK,
        MESSAGES.RESTAURANT.FETCHED_RESTAURANT,
        restaurant || undefined,
      );
    } catch (e) {
      logger.error("ERROR: View Restaurant");
      next(e);
    }
  }

  async createRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const data = restaurantSchema.parse(req.body);
      const restaurant = await this._restaurantService.createRestaurant(data);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTPSTATUSCODES.CREATED,
        MESSAGES.RESTAURANT.CREATED,
        restaurant,
      );
    } catch (e) {
      logger.error("ERROR: Create Restaurant");
      next(e);
    }
  }

  async updateRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      let numericId;
      if (id && !isNaN(parseInt(id))) {
        numericId = parseInt(id);
      } else {
        throw new CustomError(HTTPSTATUSCODES.BAD_REQUEST, MESSAGES.INVALID_ID);
      }
      const data = restaurantSchema.parse(req.body);
      data.id = numericId;
      const restaurant = await this._restaurantService.updateRestaurant(data);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTPSTATUSCODES.OK,
        MESSAGES.RESTAURANT.UPDATED,
        restaurant || undefined,
      );
    } catch (e) {
      logger.error("ERROR: Update Restaurant");
      next(e);
    }
  }

  async deleteRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id) {
        throw new CustomError(HTTPSTATUSCODES.BAD_REQUEST, MESSAGES.INVALID_ID);
      }
      const restaurant = await this._restaurantService.deleteRestaurant(id);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTPSTATUSCODES.OK,
        MESSAGES.RESTAURANT.DELETED,
        restaurant || undefined,
      );
    } catch (e) {
      logger.error("ERROR: Delete Restaurant");
      next(e);
    }
  }
}
