import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { environment } from "../../core/EnvVars";

const allowedPaths = ["/api/login"];

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (allowedPaths.includes(request.path)) {
    return next();
  }

  const {
    headers: { authorization },
  } = request;

  if (!authorization) {
    return response.status(401).json({ message: "Authorization is missing" });
  }

  const [, token = ""] = authorization.split(" ");

  try {
    request.loggedUser = jsonwebtoken.verify(token, environment.JWT_SECRET);

    next();
  } catch (error) {
    response.status(401).json({ message: "Not authorized" });
  }
}
