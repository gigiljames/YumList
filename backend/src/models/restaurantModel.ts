import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelize } from "../config/dbConfig";


export interface IRestaurant {
  id: number;
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
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Restaurant extends Model<InferAttributes<Restaurant>,
  InferCreationAttributes<Restaurant>
> implements IRestaurant {
  declare id: number;
  declare name: string;
  declare address: string | null;
  declare latitude: number | null;
  declare longitude: number | null;
  declare email: string | null;
  declare phone: string | null;
  declare website: string | null;
  declare displayImage: string | null;
  declare tags: string[];
  declare averageSpending: number;
  declare isListed: boolean;
  declare mode: "DINING" | "TAKEOUT" | "BOTH";
  declare createdAt: Date;
  declare updatedAt: Date;
}

Restaurant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    mode: {
      type: DataTypes.ENUM("DINING", "TAKEOUT", "BOTH"),
      allowNull: false,
    },
    averageSpending: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isListed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },
  { sequelize, modelName: "Restaurant", timestamps: true },
);
