import { z } from "zod";

export const restaurantSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .trim()
    .min(3, "Restaurant name must be at least 3 characters")
    .max(100, "Restaurant name cannot exceed 100 characters"),
  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .default(""),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .default(-1),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .default(-1),
  email: z.string().default(""),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .default(""),
  website: z.string().optional().default(""),
  displayImage: z.string().optional().default(""),
  tags: z.array(z.string().trim()).default([]),
  mode: z.enum(["DINING", "TAKEOUT", "BOTH"]),
  averageSpending: z
    .number()
    .nonnegative("Average spending cannot be negative"),
});

export const restaurantQuerySchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  tags: z
    .union([
      z.string().transform((tag) => [tag]), // ?tags=veg
      z.array(z.string()), // ?tags=veg&tags=family
    ])
    .optional(),
  mode: z.enum(["DINING", "TAKEOUT", "BOTH"]).optional(),
  averageSpending: z
    .string()
    .regex(/^\d+$/, "Average spending must be a positive number")
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive number")
    .transform(Number)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive number")
    .transform(Number)
    .optional(),
});
