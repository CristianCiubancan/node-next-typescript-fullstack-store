import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import * as http from "http";
import * as https from "https";
import Redis from "ioredis";
import path from "path";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Category } from "./entities/Category/Category";
import { CategoryProduct } from "./entities/Category/CategoryProduct";
import { ImageSize } from "./entities/Image/ImageSize";
import { Attribute } from "./entities/Product/Attribute";
import { Product } from "./entities/Product/Product";
import { Image } from "./entities/Image/Image";
import { ProductImage } from "./entities/Product/ProductImage";
import { Value } from "./entities/Product/Value";
import { Variation } from "./entities/Product/Variation";
import { VariationAttributeValue } from "./entities/Product/VariationAttributeValue";
import { User } from "./entities/User/User";
import { buildRedisClient } from "./redis";
import { routes } from "./routes";
import { Specification } from "./entities/Product/Specification";
import { Order } from "./entities/Order/Order";
import { OrderItem } from "./entities/Order/OrderItem";
import cron from "node-cron";

//code to keep session alive even if errors accour
process.on("uncaughtException", (err) => {
  console.error(err && err.stack);
});

const main = async () => {
  //Redis
  const redisClient = __prod__
    ? buildRedisClient()
    : new Redis({ host: "localhost", port: 6379 });

  if (redisClient) {
    // connectiong to pg database
    // const conn =
    await createConnection({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      logging: false,
      // ssl: __prod__ ? { rejectUnauthorized: false } : false,
      ssl: false,
      synchronize: true,
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [
        User,
        Product,
        Value,
        Attribute,
        Variation,
        Specification,
        ProductImage,
        VariationAttributeValue,
        Category,
        Image,
        ImageSize,
        Order,
        OrderItem,
        CategoryProduct,
      ],
    });

    // running migrations as synchronize:true is not reccomended
    // because it might break the db in prod
    // await conn.runMigrations() ;

    //initializing express app
    const app = express();

    //setup to store session inside Redis
    const RedisStore = connectRedis(session);

    //cors options for http and socket servers
    const serverCorse = {
      origin: [
        process.env.CORS_ORIGIN_CLIENT,
        process.env.CORS_ORIGIN_ADMIN,
        "http://localhost:3001",
        "http://192.168.100.3:3000",
        "http://192.168.100.42:3000",
      ],

      credentials: true,
    };

    //cookie setup
    const sessionMiddleware = session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, //cookie only works in https
        domain: __prod__ ? ".happyoctopus.net" : undefined, //de scos secure false si de folosit ce e comentat
        maxAge: 1000 * 60 * 60 * 24 * 10, //10 days
      },
    } as any);

    //this is needed in order to get cookies working i guess
    app.set("trust proxy", 1);

    //adding cors
    app.use(cors(serverCorse));

    //adding body parser
    app.use(express.json());

    //using cookie session
    app.use(sessionMiddleware);

    //initializing http server
    const server = http.createServer(app);

    //http paths
    routes(app, redisClient);

    //cron job to keep vercel functions alive and improve performance
    cron.schedule("*/1 * * * *", async () => {
      https.get(process.env.CORS_ORIGIN_CLIENT as string).on("error", (err) => {
        console.log("Error: ", err.message);
      });
      console.log("client warmed");
    });

    server.listen(process.env.SERVER_PORT, () => {
      console.log(
        `server listening at http://localhost:${process.env.SERVER_PORT}`
      );
    });
  } else {
    console.log("redis cluster does not exist");
  }
};

main();
