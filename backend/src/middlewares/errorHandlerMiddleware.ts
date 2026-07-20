import { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants/messages";
import { devLogger, productionLogger } from "../utils/logger";
import { env } from "../config/envConfig";
import { HTTPSTATUSCODES } from "../constants/httpStatusCodes";
import { HTTPResponseBuilder } from "../utils/httpResponseBuilder";
import { CustomError } from "../shared/customError";

export function errorHandlerMiddleware(
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  void next;
  const statusCode: number =
    err instanceof CustomError
      ? err.statusCode
      : HTTPSTATUSCODES.INTERNAL_SERVER_ERROR;
  if (env.NODE_ENV === "production") {
    productionLogger.error(err.message || MESSAGES.SOMETHING_WENT_WRONG);
  } else {
    devLogger.error(err.message || MESSAGES.SOMETHING_WENT_WRONG);
    if (err instanceof CustomError && err.details) {
      devLogger.error(err.details);
    }
    devLogger.error(err.stack);
  }
  HTTPResponseBuilder.buildErrorResponse(
    req,
    res,
    statusCode,
    err.message || MESSAGES.SOMETHING_WENT_WRONG,
  );
}
