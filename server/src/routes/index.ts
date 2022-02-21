import express from "express";
import { Cluster, Redis } from "ioredis";
import multer from "multer";
import { CartItem } from "../types/order";
import { Req } from "../types/networkingTypes";
import handleCreateCategory from "./categories/createCategory";
import handleGetAllCategories from "./categories/getAllCategories";
import handleGetStoreCategories from "./categories/getStoreCategories";
import handleGetStoreCategoryParents from "./categories/getStoreCategoryParents";
import handleRemoveCategory from "./categories/removeCategory";
import handleDeleteImages from "./images/deleteImages";
import handleGetImages from "./images/getImages";
import handleUploadImages from "./images/uploadImages";
import handleCheckOrder from "./order/checkOrder";
import handleCompleteOrder from "./order/completeOrder";
import handleEditProduct from "./product/editProduct";
import handleGetProductAttributes from "./product/getAttributesAndValues";
import { handleGetRelatedProducts } from "./product/getRelatedProducts";
import handleGetStoreProducts from "./product/getStoreProducts";
import handleConfirmAdmin from "./user/confirmAdmin";
import handleLogin from "./user/login";
import handleLogout from "./user/logout";
import handleRegister from "./user/register";
import Stripe from "stripe";
import { getConnection } from "typeorm";
import { Variation } from "../entities/Product/Variation";
import handleGerOrders from "./order/getOrders";
import handleEditOrderStatus from "./order/editOrderStatus";
import handleGetProducts from "./product/getProducts";
import handleCreateProduct from "./product/createProduct";
import handleDeleteProduct from "./product/deleteProduct";
import handleGetProduct from "./product/getProduct";
import handleGetCategoryName from "./categories/getCategoryName";

//multer for file upload
const upload = multer({});

export const routes = (
  app: express.Application,
  redisClient: Cluster | Redis
) => {
  app.get("/", (_req: Req, res) => {
    res.json(`Hello vtm`);
  });

  app.post("/register", (req, res) => {
    handleRegister(req, res, redisClient);
  });

  app.post("/login", (req, res) => {
    handleLogin(req, res);
  });

  app.post("/confirmAdmin", (req, res) => {
    handleConfirmAdmin(req, res, redisClient);
  });

  app.get("/getImages", (req: Req, res) => {
    handleGetImages(req, res);
  });

  app.post("/uploadImages", upload.any(), (req, res) => {
    handleUploadImages(req, res);
  });

  app.post("/deleteImages", (req, res) => {
    handleDeleteImages(req, res);
  });

  app.post("/createCategory", (req: Req, res) => {
    handleCreateCategory(req, res);
  });

  app.post("/removeCategory", (req: Req, res) => {
    handleRemoveCategory(req, res);
  });

  app.get("/getAllCategories", (req: Req, res) => {
    handleGetAllCategories(req, res);
  });

  app.post("/getProducts", (req: Req, res) => {
    handleGetProducts(req, res);
  });

  app.post("/createProduct", (req: Req, res) => {
    handleCreateProduct(req, res);
  });

  app.post("/editProduct", (req: Req, res) => {
    handleEditProduct(req, res);
  });

  app.post("/deleteProduct", (req, res) => {
    handleDeleteProduct(req, res);
  });

  app.post("/getProduct", (req, res) => {
    handleGetProduct(req, res);
  });

  app.post("/getCategoryName", (req, res) => {
    handleGetCategoryName(req, res);
  });

  app.get("/getStoreCategories", (req: Req, res) => {
    handleGetStoreCategories(req, res);
  });

  app.get("/getStoreCategoryParents/:categoryId", (req: Req, res) => {
    handleGetStoreCategoryParents(req, res);
  });

  app.get("/getAttributes/:categoryId/:searchField", (req, res) => {
    handleGetProductAttributes(req, res);
  });

  app.post("/getStoreProducts", (req, res) => {
    handleGetStoreProducts(req, res);
  });

  app.post("/getRelatedProducts", (req, res) => {
    handleGetRelatedProducts(req, res);
  });

  app.post("/editOrderStatus", (req, res) => {
    handleEditOrderStatus(req, res);
  });

  app.post("/checkOrder", (req, res) => {
    handleCheckOrder(req, res);
  });

  app.post("/completeOrder", (req, res) => {
    handleCompleteOrder(req, res);
  });

  app.get("/getOrders/:orderStatus", (req, res) => {
    handleGerOrders(req, res);
  });

  app.get("/logout", (req, res) => {
    handleLogout(req, res);
  });

  const stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: "2020-08-27",
  });

  app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    const calculateOrderAmount = async (items: CartItem[]) => {
      const products = await getConnection()
        .query(
          `
          select * from variation v where v.sku in (${items.map(
            (item) => `'${item.variationSku}'`
          )})
        `
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });

      const amountToCharge = products
        .map((product: Variation) =>
          parseFloat(
            (
              product.price *
              items.filter((item) => item.variationSku === product.sku)[0]
                .quantity
            ).toFixed(2)
          )
        )
        .reduce((partialSum: number, a: number) => partialSum + a, 0)
        .toFixed(2);

      return parseInt((parseFloat(amountToCharge) * 100 + 2000).toString());
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: await calculateOrderAmount(items),
      currency: "ron",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });
};
