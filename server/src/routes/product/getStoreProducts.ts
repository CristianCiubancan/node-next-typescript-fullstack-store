import express from "express";
import { Product } from "../../types/product";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

export interface FilterAttribute {
  name: string;
  values: string[];
}

export interface PaginatedProductsForm {
  categoryId: string | null;
  searchBy: string;
  searchField: string;
  sort: string;
  attributes: FilterAttribute[];
}

interface PaginatedProductsRequestValue extends PaginatedProductsForm {
  cursor: string;
}

const handleGetStoreProducts = async (req: Req, res: express.Response) => {
  const { cursor, searchBy, searchField, categoryId, sort, attributes } =
    req.body as PaginatedProductsRequestValue;

  const realLimitPlusOne = 16 + 1;

  const sortElements = sort.split(":");

  const attributeClauses = attributes?.map(
    (atr) =>
      `(at.name = '${atr.name}' AND va.name in (${atr.values.map(
        (val) => `'${val}'`
      )}))`
  );

  let products: Product[] = [];
  if (categoryId) {
    if (categoryId === "uncategorized") {
      products = await getConnection()
        .query(
          `
        select * from (SELECT
            p.*,
            ARRAY (
              SELECT
                jsonb_build_object('id', c.id, 'name', c.name)
              FROM
                category_product pc
                JOIN category c ON pc."categoryId" = c.id
              WHERE
                pc."productId" = p.id
            ) AS categories,
            (
              SELECT
                jsonb_agg(jsonb_build_object(
                  'id',
                  at.id,
                  'name',
                  at.name,
                  'values',
                  ARRAY (
                    SELECT
                      jsonb_build_object('id', v.id, 'name', v.name)
                    FROM
                      value v
                    WHERE
                      at.id = v."attributeId"
                  )
                ))
              FROM
                attribute at join value va on at.id = va."attributeId"
              WHERE
                at."productId" = p.id 
                    ${
                      attributes ? `and (${attributeClauses.join(" OR ")})` : ""
                    }
            ) AS attributes,
            ARRAY (
              SELECT
                jsonb_build_object(
                  'id',
                  va.id,
                  'sku',
                  va.sku,
                  'name',
                  va.name,
                  'price',
                  va.price,
                  'stock',
                  va.stock,
                  'discountMultiplier',
                  va."discountMultiplier",
                  'attributes',
                  ARRAY (
                    SELECT
                      jsonb_build_object(
                        'id',
                        vat.id,
                        'name',
                        vat.name,
                        'values',
                        ARRAY (
                          SELECT
                            jsonb_build_object('id', value.id, 'name', value.name)
                          FROM
                            value
                          where
                            value."attributeId" = vat.id
                        )
                      )
                    FROM
                      attribute vat
                    WHERE
                      vat."productId" = va."productId"
                  )
                )
              FROM
                variation va
              WHERE
                va."productId" = p.id
            ) AS variations,
            ARRAY (
              SELECT
                jsonb_build_object(
                  'id',
                  i.id,
                  'placeholderUrl',
                  i."placeholderUrl",
                  'name',
                  i.name,
                  'url',
                  i.url,
                  'sizes',
                  ARRAY (
                    SELECT
                      jsonb_build_object(
                        'id',
                        isx.id,
                        'name',
                        isx.name,
                        'width',
                        isx.width,
                        'url',
                        isx.url
                      )
                    FROM
                      image_size isx
                    WHERE
                      isx."parentImageId" = i.id
                  )
                )
              FROM
                image i
                JOIN product_image pi ON i.id = pi."imageId"
              WHERE
                pi."productId" = p.id
            ) AS images
          FROM
            product p
            left join category_product ct on p.id = ct."productId"
          where
            ct."categoryId" is null) prs

        where ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
        ${
          attributes
            ? `and attributes @> '[${attributes
                .map((attr) => {
                  return `{ "name": "${attr.name}" }`;
                })
                .join(", ")}]' and attributes != '{}'`
            : ""
        }
        ${
          cursor
            ? `and (${sortElements[0]}, sku) ${
                sortElements[1] === "DESC" ? "<" : ">"
              } ${cursor}`
            : ""
        }
        ORDER BY
        ${sortElements[0]} ${sortElements[1]}, sku ${sortElements[1]}
        limit ${realLimitPlusOne}
        `
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    } else {
      products = await getConnection()
        .query(
          `
      select * from  (WITH recursive recursiontable (id, name, "parentCategoryId", depth) AS (
            SELECT
              id,
              name,
              "parentCategoryId",
              1
            FROM
              category
            WHERE
              "parentCategoryId" = ${categoryId}
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
          select
            p.*,
            ARRAY (
              SELECT
                jsonb_build_object('id', c.id, 'name', c.name)
              FROM
                category_product pc
                JOIN category c ON pc."categoryId" = c.id
              WHERE
                pc."productId" = p.id
            ) AS categories,
            (
              SELECT
                jsonb_agg(jsonb_build_object(
                  'id',
                  at.id,
                  'name',
                  at.name,
                  'values',
                  ARRAY (
                    SELECT
                      jsonb_build_object('id', v.id, 'name', v.name)
                    FROM
                      value v
                    WHERE
                      at.id = v."attributeId"
                  )
                ))
                FROM
                attribute at join value va on at.id = va."attributeId"
              where
                at."productId" = p.id 
                    ${
                      attributes ? `and (${attributeClauses.join(" OR ")})` : ""
                    }
            ) AS attributes,
            ARRAY (
              SELECT
                jsonb_build_object(
                  'id',
                  va.id,
                  'sku',
                  va.sku,
                  'name',
                  va.name,
                  'price',
                  va.price,
                  'stock',
                  va.stock,
                  'discountMultiplier',
                  va."discountMultiplier",
                  'attributes',
                  ARRAY (
                    SELECT
                      jsonb_build_object(
                        'id',
                        vat.id,
                        'name',
                        vat.name,
                        'values',
                        ARRAY (
                          SELECT
                            jsonb_build_object('id', value.id, 'name', value.name)
                          FROM
                            value
                          where
                            value."attributeId" = vat.id
                        )
                      )
                    FROM
                      attribute vat
                    WHERE
                      vat."productId" = va."productId"
                  )
                )
              FROM
                variation va
              WHERE
                va."productId" = p.id
            ) AS variations,
            ARRAY (
              SELECT
                jsonb_build_object(
                  'id',
                  i.id,
                  'placeholderUrl',
                  i."placeholderUrl",
                  'name',
                  i.name,
                  'url',
                  i.url,
                  'sizes',
                  ARRAY (
                    SELECT
                      jsonb_build_object(
                        'id',
                        isx.id,
                        'name',
                        isx.name,
                        'width',
                        isx.width,
                        'url',
                        isx.url
                      )
                    FROM
                      image_size isx
                    WHERE
                      isx."parentImageId" = i.id
                  )
                )
              FROM
                image i
                JOIN product_image pi ON i.id = pi."imageId"
              WHERE
                pi."productId" = p.id
            ) AS images
          from
            (
              select
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
                ct.id = ${categoryId}
              order by
                depth
            ) ac
            join category_product cp on cp."categoryId" = ac.id
            join product p on cp."productId" = p.id) pr
  where ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
  ${
    attributes
      ? `and attributes @> '[${attributes
          .map((attr) => {
            return `{ "name": "${attr.name}" }`;
          })
          .join(", ")}]' and attributes != '{}'`
      : ""
  }
      ${
        cursor
          ? `and (${sortElements[0]}, sku) ${
              sortElements[1] === "DESC" ? "<" : ">"
            } ${cursor}`
          : ""
      }
      ORDER BY
      ${sortElements[0]} ${sortElements[1]}, sku ${sortElements[1]}
      LIMIT ${realLimitPlusOne}
    `
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    }
  } else {
    products = await getConnection()
      .query(
        `
    select * from ( SELECT
  p.*,
  ARRAY (
    SELECT
      jsonb_build_object('id', c.id, 'name', c.name)
    FROM
      category_product pc
      JOIN category c ON pc."categoryId" = c.id
    WHERE
      pc."productId" = p.id
  ) AS categories,
  (
    SELECT
      jsonb_agg(jsonb_build_object(
        'id',
        at.id,
        'name',
        at.name,
        'values',
        ARRAY (
          SELECT
            jsonb_build_object('id', v.id, 'name', v.name)
          FROM
            value v
          WHERE
            at.id = v."attributeId"
        )
      ))
      FROM
      attribute at join value va on at.id = va."attributeId"
    WHERE
      at."productId" = p.id 
      ${attributes ? `and (${attributeClauses.join(" OR ")})` : ""}

  ) AS attributes,
  ARRAY (
    SELECT
      jsonb_build_object(
        'id',
        va.id,
        'sku',
        va.sku,
        'name',
        va.name,
        'price',
        va.price,
        'stock',
        va.stock,
        'discountMultiplier',
        va."discountMultiplier",
        'attributes',
        ARRAY (
          SELECT
            jsonb_build_object(
              'id',
              vat.id,
              'name',
              vat.name,
              'values',
              ARRAY (
                SELECT
                  jsonb_build_object('id', value.id, 'name', value.name)
                FROM
                  value
                where
                  value."attributeId" = vat.id
              )
            )
          FROM
            attribute vat
          WHERE
            vat."productId" = va."productId"
        )
      )
    FROM
      variation va
    WHERE
      va."productId" = p.id
  ) AS variations,
  ARRAY (
    SELECT
      jsonb_build_object(
        'id',
        i.id,
        'placeholderUrl',
        i."placeholderUrl",
        'name',
        i.name,
        'url',
        i.url,
        'sizes',
        ARRAY (
          SELECT
            jsonb_build_object(
              'id',
              isx.id,
              'name',
              isx.name,
              'width',
              isx.width,
              'url',
              isx.url
            )
          FROM
            image_size isx
          WHERE
            isx."parentImageId" = i.id
        )
      )
    FROM
      image i
      JOIN product_image pi ON i.id = pi."imageId"
    WHERE
      pi."productId" = p.id
  ) AS images
FROM
  product p) pr
 where ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
 ${
   attributes
     ? `and attributes @> '[${attributes
         .map((attr) => {
           return `{ "name": "${attr.name}" }`;
         })
         .join(", ")}]' and attributes != '{}'`
     : ""
 }
    ${
      cursor
        ? `and (${sortElements[0]}, sku) ${
            sortElements[1] === "DESC" ? "<" : ">"
          } ${cursor}`
        : ""
    }
    ORDER BY
    ${sortElements[0]} ${sortElements[1]}, sku ${sortElements[1]}
    LIMIT ${realLimitPlusOne}
  `
      )
      .catch((err) => {
        return res.json({ error: err.code });
      });
  }

  return res.json({
    products: products.slice(0, realLimitPlusOne - 1),
    hasMore: products.length === realLimitPlusOne,
  });
};

export default handleGetStoreProducts;
