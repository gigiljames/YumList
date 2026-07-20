import { Request, Response } from "express";

export interface HttpResponse {
  success: boolean;
  data?: object;
  message?: string;
  error?: string;
  statusCode: number;
}

export class HTTPResponseBuilder {
  static buildSuccessResponse(
    req: Request,
    res: Response,
    statusCode: number,
    message: string,
    data?: object,
  ): void {
    void req;
    const response: HttpResponse = {
      success: true,
      data,
      message,
      statusCode,
    };

    res.status(statusCode).json(response);
  }

  static buildErrorResponse(
    req: Request,
    res: Response,
    statusCode: number,
    error: string,
  ): void {
    void req;
    const response: HttpResponse = {
      success: false,
      error,
      message: error,
      statusCode,
    };

    res.status(statusCode).json(response);
  }
}
