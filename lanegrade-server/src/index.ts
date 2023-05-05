import cors from "cors";
import env from "dotenv";
import express from "express";
import http from "http";

import { apolloServerExpress } from "./apollo-startup";
import { connectMongoose } from "./mongoose-startup";
import { initializeFirebaseApp } from "./firebase-startup";
import { verifyToken } from "./verify-token";

env.config();
initializeFirebaseApp();

const app = express();

app.use(cors());
app.use(express.json());

app.use(verifyToken);

connectMongoose();

const httpServer = http.createServer(app);
apolloServerExpress(httpServer, app);
