import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { Express } from "express";

import { typeDefs, resolvers } from "./graphql/schema";

import * as admin from "firebase-admin";

export async function apolloServerExpress(httpServer: Server, app: Express) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageDisabled(),],
    context: ({ req }) => {
      const apiKey = req.get("API-KEY");

      if (apiKey) {
        return { isAdmin: true }
      }

      const user = req.get("user");

      const { uid } = JSON.parse(
        JSON.stringify(user)
      ) as admin.auth.DecodedIdToken;

      if (!uid) {
        throw new Error("You must be authenticated to access this resource.");
      }

      return { uid };
    },
  });

  await server.start();
  server.applyMiddleware({ app, cors: { origin: "*" } });

  await new Promise(resolve => resolve(httpServer.listen({ port: process.env.PORT })));
  console.log(`🚀 Server ready 🚀`);

}
