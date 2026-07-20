import { ROUTES } from "../constants/routes"
import type { HttpResponse, restaurant, restaurantQuery } from "../interfaces/restaurant"
import axiosInstance from "./axios"

export const createRestaurant = async (data: restaurant): Promise<HttpResponse> => {
    const response = await axiosInstance.post<HttpResponse>(ROUTES.CREATE_RESTAURANT, data);
    return response.data;
}

export const updateRestaurant = async (data: restaurant): Promise<HttpResponse> => {
    const response = await axiosInstance.patch<HttpResponse>(ROUTES.UPDATE_RESTAURANT.replace(":id", data.id + ""), data);
    return response.data;
}

export const deleteRestaurant = async (id: string): Promise<HttpResponse> => {
    const response = await axiosInstance.delete<HttpResponse>(ROUTES.DELETE_RESTAURANT.replace(":id", id));
    return response.data;
}

export const viewRestaurant = async (id: string): Promise<HttpResponse> => {
    const response = await axiosInstance.get<HttpResponse>(ROUTES.VIEW_RESTAURANT.replace(":id", id));
    return response.data;
}

export const listRestaurants = async (params?: restaurantQuery): Promise<HttpResponse> => {
    const response = await axiosInstance.get<HttpResponse>(ROUTES.LIST_RESTAURANTS, { params });
    return response.data;
}