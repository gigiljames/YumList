export interface restaurant {
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

export interface restaurantQuery {
    name?: string;
    tags?: string[];
    mode?: "DINING" | "TAKEOUT" | "BOTH";
    averageSpending?: string;
    page?: number;
    limit?: number;
}

export interface HttpResponse {
    success: boolean;
    data?: object;
    message?: string;
    error?: string;
    statusCode: number;
}