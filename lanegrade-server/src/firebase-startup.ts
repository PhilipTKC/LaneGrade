import * as admin from "firebase-admin";
import * as credentials from "./configuration/credentials.json";

const serviceAccount = credentials as admin.ServiceAccount;

export function initializeFirebaseApp() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
}
