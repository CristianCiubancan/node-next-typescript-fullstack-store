import express from "express";
import { Product } from "../../types/product";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

interface PaginatedProductsRequestValue {
  categoryId: string;
}

const handleGetAllProducts = async (req: Req, res: express.Response) => {
  const { categoryId } = req.body as PaginatedProductsRequestValue;

  let products: Product[] = [];
  if (categoryId) {
    if (categoryId === "uncategorized") {
      products = await getConnection()
        .query(
          `
        select * from (SELECT p.*, ARRAY ( SELECT jsonb_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ( SELECT jsonb_agg(jsonb_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT jsonb_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) )) FROM attribute at join value va on at.id = va."attributeId" WHERE at."productId" = p.id
        ) AS attributes, ARRAY ( SELECT jsonb_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT jsonb_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT jsonb_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT jsonb_build_object( 'id', i.id, 'placeholderUrl', i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT jsonb_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images FROM product p left join category_product ct on p.id = ct."productId" where ct."categoryId" is null) prs
        ORDER BY name ASC
   
        `
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    } else {
      products = await getConnection()
        .query(
          `
  select * from  (WITH recursive recursiontable (id, name, "parentCategoryId", depth) AS ( SELECT id, name, "parentCategoryId", 1 FROM category WHERE
  "parentCategoryId" = $1
  UNION ALL SELECT ct.id, ct.name, ct."parentCategoryId", cas.depth + 1 FROM category as ct JOIN recursiontable as cas on ct."parentCategoryId" = cas.id ) select p.*, ARRAY ( SELECT jsonb_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ( SELECT jsonb_agg(jsonb_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT jsonb_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) )) FROM attribute at join value va on at.id = va."attributeId" where at."productId" = p.id 
   ) AS attributes, ARRAY ( SELECT jsonb_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT jsonb_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT jsonb_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT jsonb_build_object( 'id', i.id, 'placeholderUrl', i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT jsonb_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images from ( select * from recursiontable UNION ALL SELECT ct.id, ct.name, ct."parentCategoryId", 0 FROM category as ct where ct.id = 
  $1 order by depth ) ac join category_product cp on cp."categoryId" = ac.id join product p on cp."productId" = p.id) pr
      ORDER BY name ASC
    `,
          [categoryId]
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    }
  } else {
    products = await getConnection()
      .query(
        `
select * from ( SELECT p.*, ARRAY ( SELECT jsonb_build_object('id', c.id, 'name', c.name) FROM category_product pc JOIN category c ON pc."categoryId" = c.id WHERE pc."productId" = p.id ) AS categories, ( SELECT jsonb_agg(jsonb_build_object( 'id', at.id, 'name', at.name, 'values', ARRAY ( SELECT jsonb_build_object('id', v.id, 'name', v.name) FROM value v WHERE at.id = v."attributeId" ) )) FROM attribute at join value va on at.id = va."attributeId" WHERE at."productId" = p.id
) AS attributes, ARRAY ( SELECT jsonb_build_object( 'id', va.id, 'sku', va.sku, 'name', va.name, 'price', va.price, 'stock', va.stock, 'discountMultiplier', va."discountMultiplier", 'attributes', ARRAY ( SELECT jsonb_build_object( 'id', vat.id, 'name', vat.name, 'values', ARRAY ( SELECT jsonb_build_object('id', value.id, 'name', value.name) FROM value where value."attributeId" = vat.id ) ) FROM attribute vat WHERE vat."productId" = va."productId" ) ) FROM variation va WHERE va."productId" = p.id ) AS variations, ARRAY ( SELECT jsonb_build_object( 'id', i.id, 'placeholderUrl', i."placeholderUrl", 'name', i.name, 'url', i.url, 'sizes', ARRAY ( SELECT jsonb_build_object( 'id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url ) FROM image_size isx WHERE isx."parentImageId" = i.id ) ) FROM image i JOIN product_image pi ON i.id = pi."imageId" WHERE pi."productId" = p.id ) AS images FROM product p) pr
    ORDER BY name ASC
  `
      )
      .catch((err) => {
        return res.json({ error: err.code });
      });
  }

  return res.json({
    products: products,
    hasMore: false,
  });
};

export default handleGetAllProducts;
