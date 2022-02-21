import express from "express";
import { getManager } from "typeorm";
import { Category } from "../../entities/Category/Category";
import { Req } from "../../types/networkingTypes";

const handleGetStoreCategories = async (_req: Req, res: express.Response) => {
  const manager = getManager();

  const categories = await manager
    .getTreeRepository(Category)
    .findTrees()
    .catch((err) => res.json({ error: err.code }));

  return res.json(categories);
};

export default handleGetStoreCategories;
