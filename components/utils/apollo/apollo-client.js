import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://jiehu.stepzen.net/api/washing-bird/__graphql",

  cache: new InMemoryCache(),
  headers: {
    Authorization: `ApiKey ${process.env.NEXT_PUBLIC_STAPZEN_KEY}`,
  },
});

export default client;
