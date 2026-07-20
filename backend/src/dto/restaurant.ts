import { IRestaurant } from "../models/restaurantModel";

export interface restaurantDTO {
  id?: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  displayImage: string | null;
  tags: string[];
  mode: "DINING" | "TAKEOUT" | "BOTH";
  averageSpending: number;
}

export interface restaurantQueryDTO {
  name?: string;
  tags?: string[];
  mode?: "DINING" | "TAKEOUT" | "BOTH";
  averageSpending?: string;
  page?: number;
  limit?: number;
}

export interface restaurantListResponseDTO {
  rows: IRestaurant[];
  count: number;
}
