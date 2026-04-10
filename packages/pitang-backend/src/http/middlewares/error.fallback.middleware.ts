import type { NextFunction, Request, Response } from "express";
import { environment } from "../../core/EnvVars";

export function errorFallbackMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error.stack);

  if (environment.NODE_ENV === "development") {
    return response
      .status(400)
      .json({ message: "Something went wrong", stack: error });
  }

  response.status(400).json({ message: "Something went wrong" });
}
