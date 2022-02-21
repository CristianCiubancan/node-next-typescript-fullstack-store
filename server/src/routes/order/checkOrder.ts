import express from "express";
import { CartItem, CheckOrderRequestObject } from "../../types/order";
import { Req } from "../../types/networkingTypes";
import { getConnection } from "typeorm";
import { Variation } from "../../types/product";

export interface HalfAvailableItem extends CartItem {
  availableQuantity: number;
}

const handleCheckOrder = async (req: Req, res: express.Response) => {
  const requestObject: CheckOrderRequestObject = req.body;

  const reqItemSkus = requestObject.items.map((item) => item.variationSku);

  const products = await getConnection()
    .query(
      `
    select * from variation v
    where v.sku = ANY ($1)
    `,
      [reqItemSkus]
    )
    .catch((err) => {
      res.json({ error: err.code });
    });

  let availableItems: CartItem[] = [];
  let unavailableItems: CartItem[] = [];
  let halfAvailableItems: HalfAvailableItem[] = [];
  let newCartItems: CartItem[] = [];

  requestObject.items.forEach((item) => {
    const dbItem: Variation = products.filter(
      (product: Variation) => product.sku === item.variationSku
    )[0];

    if (dbItem.stock >= item.quantity) {
      availableItems.push(item);
      newCartItems.push(item);
    } else {
      if (dbItem.stock === 0) {
        unavailableItems.push(item);
      } else {
        halfAvailableItems.push({
          ...item,
          availableQuantity: dbItem.stock,
        });
        newCartItems.push({ ...item, quantity: dbItem.stock });
      }
    }
  });

  return res.json({
    availableItems,
    unavailableItems,
    halfAvailableItems,
    newCartItems,
  });
};

export default handleCheckOrder;
