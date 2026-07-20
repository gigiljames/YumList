import { Router } from "express";
import { ROUTES } from "../constants/routes";
import { injectedRestaurantController } from "../di/restaurant";

export class RestaurantRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this.router.get(ROUTES.LIST_RESTAURANTS, (req, res, next) => {
      injectedRestaurantController.listRestaurants(req, res, next);
    });

    this.router.get(ROUTES.VIEW_RESTAURANT, (req, res, next) => {
      injectedRestaurantController.viewRestaurant(req, res, next);
    });

    this.router.post(ROUTES.CREATE_RESTAURANT, (req, res, next) => {
      injectedRestaurantController.createRestaurant(req, res, next);
    });

    this.router.patch(ROUTES.UPDATE_RESTAURANT, (req, res, next) => {
      injectedRestaurantController.updateRestaurant(req, res, next);
    });

    this.router.delete(ROUTES.DELETE_RESTAURANT, (req, res, next) => {
      injectedRestaurantController.deleteRestaurant(req, res, next);
    });
  }
}
