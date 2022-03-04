import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleGetAllProductsIds = async (_req: Req, res: express.Response) => {
  const products = await getConnection()
    .query(
      `
      select sku from product
  `
    )
    .catch((err) => {
      res.json({ error: err.code });
    });

  return res.json(products);
};

export default handleGetAllProductsIds;
