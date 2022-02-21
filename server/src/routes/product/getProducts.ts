import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

export interface PaginatedProductsForm {
  categoryId: string | null;
  searchBy: string;
  searchField: string;
  sort: string;
}

interface PaginatedProductsRequestValue extends PaginatedProductsForm {
  cursor: string;
}

const handleGetProducts = async (req: Req, res: express.Response) => {
  const { cursor, searchBy, searchField, categoryId, sort } =
    req.body as PaginatedProductsRequestValue;

  const realLimitPlusOne = 16 + 1;

  const sortElements = sort.split(":");

  let products;
  if (categoryId) {
    if (categoryId === "uncategorized") {
      products = await getConnection()
        .query(
          `
        SELECT p.*, ARRAY ( SELECT json_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ARRAY ( SELECT json_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT json_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) ) FROM attribute at WHERE at."productId" = p.id ) AS attributes, ARRAY ( SELECT json_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT json_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT json_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT json_build_object( 'id', i.id, 'placeholderUrl',i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT json_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images FROM product p
        left join category_product ct 
        on p.id = ct."productId"
        where ct."categoryId" is null
        and ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
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
      select pr.* from category_product ct join ( SELECT p.*, ARRAY ( SELECT json_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ARRAY ( SELECT json_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT json_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) ) FROM attribute at WHERE at."productId" = p.id ) AS attributes, ARRAY ( SELECT json_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT json_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT json_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT json_build_object( 'id', i.id,'placeholderUrl',i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT json_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images FROM product p ) as pr on pr.id = ct."productId"
      where ct."categoryId" = ${categoryId}
      and ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
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
    SELECT p.*, ARRAY ( SELECT json_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ARRAY ( SELECT json_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT json_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) ) FROM attribute at WHERE at."productId" = p.id ) AS attributes, ARRAY ( SELECT json_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT json_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT json_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT json_build_object( 'id', i.id,'placeholderUrl',i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT json_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images FROM product p
    where ${searchBy} ILIKE '%${searchField.split(" ").join("%")}%'
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

export default handleGetProducts;
