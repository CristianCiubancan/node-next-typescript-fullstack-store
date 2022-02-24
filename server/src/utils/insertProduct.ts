import { CreateProduct } from "../routes/product/createProduct";
import { getConnection } from "typeorm";
import { Product } from "../entities/Product/Product";
import { ProductImage } from "../entities/Product/ProductImage";
import { CategoryProduct } from "../entities/Category/CategoryProduct";
import { Attribute } from "../entities/Product/Attribute";
import { Value } from "../entities/Product/Value";
import { Variation } from "../entities/Product/Variation";
import { VariationAttributeValue } from "../entities/Product/VariationAttributeValue";
import { Specification } from "../entities/Product/Specification";

export const insertProduct = async (productData: CreateProduct) => {
  const prices = productData.variations.map(
    (variation) =>
      (variation.price * (100 - parseFloat(variation.discountMultiplier))) / 100
  );

  const productId = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Product)
    .values({
      name:
        productData.name.charAt(0).toUpperCase() + productData.name.slice(1),
      description: productData.description,
      minPrice:
        productData.variations.length > 0
          ? Math.min(...prices)
          : parseFloat(productData.price),
      maxPrice:
        productData.variations.length > 0
          ? Math.max(...prices)
          : parseFloat(productData.price),
      stock:
        productData.stock === "" ? 0 : parseInt(productData.stock as string),
      discountMultiplier:
        productData.discountMultiplier === ""
          ? 1
          : (100 - parseFloat(productData.discountMultiplier)) / 100,
      isOnSale: Math.min(...prices) !== Math.max(...prices),
      sku: productData.sku,
    })
    .returning("*")
    .execute();

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(ProductImage)
    .values(
      productData.images.map((image) => {
        return {
          productId: (productId as any).generatedMaps[0].id,
          imageId: image.id,
        };
      })
    )
    .returning("*")
    .execute();

  if (productData.categories[0]) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(CategoryProduct)
      .values({
        productId: (productId as any).generatedMaps[0].id,
        categoryId: productData.categories[0].id,
      })
      .returning("*")
      .execute();
  }

  let attributes: any[] = [];

  if (productData.attributes.length > 0) {
    const attrs = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Attribute)
      .values(
        productData.attributes.map((attr) => {
          return {
            productId: (productId as any).generatedMaps[0].id,
            name: attr.name,
          };
        })
      )
      .returning("*")
      .execute();

    attributes = attrs.generatedMaps;
  }

  const valuesToInsert = productData.attributes
    .map((attribute) =>
      attribute.values.map((value) => {
        return {
          attributeId: attributes.filter(
            (dbAttribute: any) => dbAttribute.name === attribute.name
          )[0].id as number,
          name: value.name,
        };
      })
    )
    .flat();

  let values: any[] = [];

  if (valuesToInsert.length > 0) {
    const vals = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Value)
      .values(valuesToInsert)
      .returning("*")
      .execute();

    values = vals.generatedMaps;
  }

  const variationsToInsert = productData.variations
    .map((variation) => {
      return {
        productId: (productId as any).generatedMaps[0].id,
        name: variation.name,
        price: variation.price,
        stock: variation.stock,
        discountMultiplier:
          variation.discountMultiplier === ""
            ? 1
            : (100 - parseFloat(variation.discountMultiplier)) / 100,
        sku: `${productData.sku}-${variation.name}`,
      };
    })
    .flat();

  if (variationsToInsert.length > 0) {
    const varis = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Variation)
      .values(variationsToInsert)
      .returning("*")
      .execute();

    const variations = varis.generatedMaps;

    const variationAttributeValuesToInsert = productData.variations
      .map((variation) =>
        variation.attributes.map((attr: any) => {
          const attributeId = attributes.filter(
            (dbAttribute: any) => dbAttribute.name === attr.name
          )[0].id;

          return {
            variationId: variations.filter(
              (dbVariation: any) => dbVariation.name === variation.name
            )[0].id,
            valueId: values.filter(
              (dbValues: any) =>
                dbValues.name === attr.values[0].name &&
                dbValues.attributeId === attributeId
            )[0].id,
            attributeId,
          };
        })
      )
      .flat();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(VariationAttributeValue)
      .values(variationAttributeValuesToInsert)
      .returning("*")
      .execute();
  }

  if (productData.specifications.length) {
    const specificationsToInsert = productData.specifications.map(
      (specification) => {
        return {
          name: specification.name,
          value: specification.value,
          product: { id: (productId as any).generatedMaps[0].id },
        };
      }
    );

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Specification)
      .values(specificationsToInsert)
      .returning("*")
      .execute();
  }

  const product = await getConnection().query(
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
                pc."productId" = p.id) AS categories,
        ARRAY (
            SELECT
                json_build_object('id', at.id, 'name', at.name, 'values', ARRAY (
                        SELECT
                            json_build_object('id', v.id, 'name', v.name)
                        FROM value v
                        WHERE
                            at.id = v."attributeId"))
            FROM
                attribute at
            WHERE
                at."productId" = p.id) AS attributes,
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
                json_build_object('id', i.id, 'name', i.name, 'url', i.url, 'sizes', ARRAY (
                        SELECT
                            json_build_object('id', isx.id, 'name', isx.name, 'width', isx.width, 'url', isx.url)
                        FROM image_size isx
                    WHERE
                        isx."parentImageId" = i.id))
            FROM
                image i
                JOIN product_image pi ON i.id = pi."imageId"
            WHERE
                pi."productId" = p.id) AS images,
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
        where p.id = $1
        `,
    [(productId as any).generatedMaps[0].id]
  );

  return product[0];
};
