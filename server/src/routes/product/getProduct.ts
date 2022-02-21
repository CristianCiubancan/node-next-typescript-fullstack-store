import express from "express";
import { Product } from "../../types/product";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

export interface CreateProduct extends Product {
  price: string;
}

const handleGetProduct = async (req: Req, res: express.Response) => {
  const body: CreateProduct = req.body;

  const product = await getConnection()
    .query(
      `
    SELECT
  p.*,
  ARRAY (
    SELECT
      json_build_object('id', c.id, 'name', c.name)
    FROM
      category_product pc
      JOIN category c ON pc."categoryId" = c.id
    WHERE
      pc."productId" = p.id
  ) AS categories,
  ARRAY (
    SELECT
      json_build_object(
        'id',
        at.id,
        'name',
        at.name,
        'values',
        ARRAY (
          SELECT
            json_build_object('id', v.id, 'name', v.name)
          FROM
            value v
          WHERE
            at.id = v."attributeId"
        )
      )
    FROM
      attribute at
    WHERE
      at."productId" = p.id
  ) AS attributes,
  ARRAY (
    SELECT
      json_build_object(
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
            json_build_object(
              'id',
              vat.id,
              'name',
              vat.name,
              'values',
              ARRAY (
                SELECT
                  json_build_object('id', value.id, 'name', value.name)
                FROM
                  value join variation_attribute_value vav on value.id = vav."valueId" 
                where
                  vav."attributeId" = vat.id 
				        and vav."variationId" = va.id
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
      json_build_object(
        'id',
        i.id,
        'name',
        i.name,
        'placeholderUrl',
        i."placeholderUrl",
        'url',
        i.url,
        'sizes',
        ARRAY (
          SELECT
            json_build_object(
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
  ) AS images,
  ARRAY (
    SELECT
    jsonb_build_object(
      'id',
      s.id,
      'name',
      s.name,
      'value',
      s.value
    )
    FROM
      specification s
    WHERE
      s."productId" = p.id
  ) AS specifications
FROM
  product p
    where p.sku = $1
    `,
      [body.id]
    )
    .catch((err) => {
      return res.json({ error: err.code });
    });

  if (!product[0]) return res.json({ error: "product not found" });
  return res.json(product[0]);
};

export default handleGetProduct;
