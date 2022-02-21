import express from "express";
import { Product } from "../../entities/Product/Product";
import { Req } from "../../types/networkingTypes";

const handleDeleteProduct = async (req: Req, res: express.Response) => {
  await Product.delete(req.body.id).catch((err) => {
    return res.json({ error: err.code });
  });

  return res.json("success");
};

export default handleDeleteProduct;
