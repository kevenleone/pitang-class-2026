import "express";

declare module "express-serve-static-core" {
  interface Request {
    loggedUser?: {
      id: string;
      email: string;
    };
  }
}
