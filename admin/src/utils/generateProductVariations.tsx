import { Attribute, Variation } from "../types/product";

export const cartesianProduct = (
  arrays: any[][],
  names: any[],
  productPrice: number,
  productDiscount: string
) => {
  let productVariations = [...arrays].reduce(
    (a, b, idx) =>
      a
        .map((x) =>
          b.map((y) => {
            return [...x, { attribute: names[idx], value: y }];
          })
        )
        .reduce((a, b) => {
          return a.concat(b);
        }, []),
    [[]]
  );

  const productVariationsComplete = productVariations.map((prod) => {
    const attributesArray = prod.map(
      (attribute: any) => `${attribute.attribute}: ${attribute.value}`
    );

    const attributes = prod;

    const variation = {
      name: `${attributesArray.join(", ")}`,
      attributes: [
        prod.map((attribute: any) => {
          return {
            name: attribute.attribute,
            values: [{ name: attribute.value }],
          };
        }),
      ][0] as Attribute[],
      price: productPrice,
      stock: 1,
      discountMultiplier: productDiscount,
      sku: "to be added on server side",
    } as Variation;

    return variation;
  });

  return productVariationsComplete;
};
