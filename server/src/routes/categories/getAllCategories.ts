import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleGetAllCategories = async (_req: Req, res: express.Response) => {
  const categories = await getConnection()
    .query(
      `
    WITH recursive recursiontable
        (
        id,
        name,
        "hierarchicalName",
        "parentCategoryId",
        depth
        )
    AS (
    SELECT 
        id,
        name,
        "hierarchicalName",
        "parentCategoryId",
        0
    FROM category
    WHERE "parentCategoryId" IS NULL

    UNION ALL
        
    SELECT
        ct.id,
        ct.name,
        ct."hierarchicalName",
        ct."parentCategoryId",
        cas.depth+1
    FROM category as ct
    JOIN recursiontable as cas on ct."parentCategoryId" = cas.id
    )
    select * from recursiontable
    order by depth
    `
    )
    .catch((err) => {
      return res.json({ error: err.code });
    });

  return res.json(categories);
};

export default handleGetAllCategories;
