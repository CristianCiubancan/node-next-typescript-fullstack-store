import express from "express";
import { Category } from "../../entities/Category/Category";
import { Req } from "../../types/networkingTypes";

const handleRemoveCategory = async (req: Req, res: express.Response) => {
  const body: any = req.body;

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

  await Category.delete(body.categoryId).catch((err) => {
    return res.json({ error: err.code });
  });

  return res.json("success");
};

export default handleRemoveCategory;
