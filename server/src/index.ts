require('dotenv').config();
import 'reflect-metadata';
import express from 'express';

import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Upvote } from './entities/Upvote';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/Hello';
import { Context } from 'apollo-server-core';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground';

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'SocialMediaVincent',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post, Upvote],
  });
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [HelloResolver], validate: false }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => console.log('Server started on port 4000'));
};
main().catch((err) => console.log(err));
