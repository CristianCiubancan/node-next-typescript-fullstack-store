import express from "express";
import { Category } from "../../entities/Category/Category";
import { getManager } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleCreateCategory = async (req: Req, res: express.Response) => {
  const body: any = req.body;
  const manager = getManager();

  if (!req.session.userId) {
    return res.json({
      error: "Your session expired, please relog",
    });
  }

  if (!req.session.isAdmin) {
    return res.json({
      error:
        "You are not authorized for this action, plase contact your supervisor",
    });
  }

  const newCategory = new Category();
  newCategory.name = body.name;
  newCategory.hierarchicalName = body.hierarchicalName;
  newCategory.parentCategoryId =
    body.parentCategoryId === "null" ? null : parseInt(body.parentCategoryId);
  if (body.parentCategory) {
    newCategory.parentCategory = body.parentCategory;
  }

  const insertedNewCategory = await manager.save(newCategory).catch((err) => {
    return res.json({ error: err.code });
  });

  return res.json(insertedNewCategory);
};

export default handleCreateCategory;
