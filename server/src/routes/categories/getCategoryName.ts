import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleGetCategoryName = async (req: Req, res: express.Response) => {
  const { id } = req.body;
  const categoryName = await getConnection()
    .query(
      `
      select * from category as c where c.id = $1
  `,
      [id]
    )
    .catch((err) => {
      res.json({ error: err.code });
    });

  return res.json(categoryName);
};

export default handleGetCategoryName;
