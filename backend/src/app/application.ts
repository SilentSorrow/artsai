import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as typeorm from 'typeorm';
import * as redis from 'redis';
import { RoutingControllersOptions, useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import {
  API_ROOT,
  API_PORT,
  DB_TYPE,
  PG_HOST,
  PG_PORT,
  PG_NAME,
  REDIS_HOST,
  REDIS_PORT,
  DEFAULT_PG_CONN_NAME,
  DEFAULT_REDIS_CONN_NAME,
} from './constants';
import { createPgConnection, createRedisConnection } from '../db';
import { ArtService, AuthService, CatalogService, UserService } from '../services';
import { ArtController, AuthController, CatalogController, UserController } from '../controllers';
import { ErrorHandlerMiddleware } from '../middlewares';

export default class Application {
  application: express.Express;
  options: AppOptions;

  constructor() {
    this.application = express();
    this.options = {
      pgConnOpts: {
        type: DB_TYPE,
        host: PG_HOST,
        port: PG_PORT,
        username: process.env.PG_USERNAME,
        password: process.env.PG_PASSWORD,
        database: PG_NAME,
        synchronize: true,
      },

      redisConnOpts: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },

      routingControllersOptions: {
        defaultErrorHandler: false,
        classTransformer: true,
        routePrefix: API_ROOT,
        controllers: [],
        middlewares: [],
        interceptors: [],
      },
    };
  }

  init(): void {
    this.application.use(bodyParser.json());
    this.application.use(express.urlencoded({ extended: false }));
    this.application.use(cors()); //{origin: "http://localhost:4000",credentials: true,})
  }

  listen(port: number = API_PORT): void {
    this.application.listen(port, () => {
      console.log(`app started listening on :${port}`);
    });
  }

  async setup(): Promise<void> {
    useContainer(Container);

    const pgConn = await createPgConnection(this.options.pgConnOpts);
    const redisConn = createRedisConnection(this.options.redisConnOpts);
    Container.set(DEFAULT_PG_CONN_NAME, pgConn);
    Container.set(DEFAULT_REDIS_CONN_NAME, redisConn);

    //Services
    const catalogService = new CatalogService(pgConn);
    const artService = new ArtService(pgConn, catalogService);
    const authService = new AuthService(pgConn, redisConn);
    const userService = new UserService(pgConn);
    Container.set(ArtService, artService);
    Container.set(AuthService, authService);
    Container.set(CatalogService, catalogService);
    Container.set(UserService, userService);

    //Controllers
    this.options.routingControllersOptions.controllers = [
      ArtController,
      AuthController,
      CatalogController,
      UserController,
    ];

    //Middlewares
    this.options.routingControllersOptions.middlewares = [ErrorHandlerMiddleware];
  }

  async start(): Promise<void> {
    this.init();
    await this.setup();

    this.application = useExpressServer(this.application, this.options.routingControllersOptions);
  }
}

type AppOptions = {
  pgConnOpts: typeorm.ConnectionOptions;
  redisConnOpts: redis.ClientOpts;
  routingControllersOptions: RoutingControllersOptions;
};
