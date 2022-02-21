import express from "express";
import { getManager } from "typeorm";
import { Category } from "../../entities/Category/Category";
import { Req } from "../../types/networkingTypes";

const handleGetStoreCategoryParents = async (
  req: Req,
  res: express.Response
) => {
  const { categoryId } = req.params;

  const manager = getManager();
  if (categoryId === "uncategorized")
    return res.json({
      id: 0,
      name: "Uncategorized",
      hierarchicalName: "Uncategorized",
      parentCategoryId: null,
    });
  const category = await Category.findOne({ where: { id: categoryId } }).catch(
    (err) => {
      return res.json({ error: err.code });
    }
  );

  const categories = await manager
    .getTreeRepository(Category)
    .findAncestorsTree(category as Category)
    .catch((err) => {
      return res.json({ error: err.code });
    });

  return res.json(categories);
};

export default handleGetStoreCategoryParents;
