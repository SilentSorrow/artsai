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
import { AuthService, UserService } from '../services';
import { AuthController, UserController } from '../controllers';
import { ErrorHandlerMiddleware } from '../middlewares';

export default class Application {
  application: express.Express;
  options: any;

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

  init() {
    this.application.use(bodyParser.json());
    this.application.use(express.urlencoded({ extended: false }));
    this.application.use(cors()); //{origin: "http://localhost:3000",credentials: true,})
  }

  listen(port: number = API_PORT) {
    this.application.listen(port, () => {
      console.log(`app started listening on :${port}`);
    });
  }

  async setup() {
    useContainer(Container);

    const pgConn = await createPgConnection(this.options.pgConnOpts as typeorm.ConnectionOptions);
    const redisConn = createRedisConnection(this.options.redisConnOpts as redis.ClientOpts);
    Container.set(DEFAULT_PG_CONN_NAME, pgConn);
    Container.set(DEFAULT_REDIS_CONN_NAME, redisConn);

    //Services
    const authService = new AuthService(pgConn, redisConn);
    const userService = new UserService(pgConn);
    Container.set(AuthService, authService);
    Container.set(UserService, userService);

    //Controllers
    this.options.routingControllersOptions.controllers = [AuthController, UserController];

    //Middlewares
    this.options.routingControllersOptions.middlewares = [ErrorHandlerMiddleware];
  }

  async start() {
    this.init();
    await this.setup();

    this.application = useExpressServer(
      this.application,
      this.options.routingControllersOptions as RoutingControllersOptions
    );
  }
}
