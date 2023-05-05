import { getAuth } from "firebase/auth";

import {
  ApolloClient, createHttpLink, InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

// https://lanegrade-server-jr9xb.ondigitalocean.app/graphql
// http://localhost:4000/graphql
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await getAuth().currentUser.getIdToken();

  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getFrames: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getTasks: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
  assumeImmutableResults: true,
});
