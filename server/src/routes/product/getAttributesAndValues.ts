import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleGetProductAttributes = async (req: Req, res: express.Response) => {
  const { categoryId, searchField } = req.params;

  let attributesAndValues = [];

  if (categoryId === "uncategorized") {
    attributesAndValues = await getConnection()
      .query(
        `
        select at.name, array_agg(distinct v.name) as values from product p left join category_product cp  on p.id = cp."productId" join attribute at on at."productId" = p.id join value v on v."attributeId" = at.id
        where cp."categoryId" is null
        GROUP BY at.name
              `
      )
      .catch((err) => {
        return res.json({ error: err.code });
      });
  } else if (categoryId === "null") {
    if (searchField !== "null") {
      attributesAndValues = await getConnection()
        .query(
          `
        select atr.name, array_agg(distinct v.name) as values from product p join attribute atr on p.id = atr."productId" join value v on v."attributeId" = atr.id  
        where p.name ilike $1
        GROUP BY 
        atr.name
        `,
          [`%${searchField.split(" ").join("%")}%`]
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    } else {
      attributesAndValues = await getConnection()
        .query(
          `
        select at.name, array_agg(distinct v.name) as values from  attribute at join value v on v."attributeId" = at.id
        GROUP BY at.name
          `
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    }
  } else {
    attributesAndValues = await getConnection()
      .query(
        `
        WITH recursive recursiontable (id, name, "parentCategoryId", depth) AS (
            SELECT
              id,
              name,
              "parentCategoryId",
              1
            FROM
              category
            WHERE
              "parentCategoryId" =  $1
            UNION ALL
            SELECT
              ct.id,
              ct.name,
              ct."parentCategoryId",
              cas.depth + 1
            FROM
              category as ct
              JOIN recursiontable as cas on ct."parentCategoryId" = cas.id
          )
          
          select at.name, array_agg(distinct value.name) as values from (select
            *
          from
            recursiontable
          UNION ALL
          SELECT
            ct.id,
            ct.name,
            ct."parentCategoryId",
            0
          FROM
            category as ct
          where
            ct.id = $1) allct 
            join category_product ct on allct.id = ct."categoryId"
            join attribute at on at."productId" = ct."productId"
            join value on at.id = value."attributeId"
          group by at.name
          
          `,
        [categoryId]
      )
      .catch((err) => {
        return res.json({ error: err.code });
      });
  }

  return res.json(attributesAndValues);
};
export default handleGetProductAttributes;
