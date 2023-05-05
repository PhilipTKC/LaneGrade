import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

export async function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { authorization } = request.headers;

  if (authorization !== "Bearer null" && authorization?.startsWith("Bearer ")) {
    const token = authorization.split("Bearer ")[1];

    if (token === process.env.Server_Key) {
      request.headers["API-KEY"] = token; 
      next();
    }

    const decodedIdToken = await admin.auth().verifyIdToken(token);

    request.headers["user"] =
        decodedIdToken as admin.auth.DecodedIdToken as unknown as string;
    
  }

  next();
}
