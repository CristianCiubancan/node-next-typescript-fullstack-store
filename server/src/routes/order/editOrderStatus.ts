import express from "express";
import { Order } from "../../types/order";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

export interface UpdateOrderStatusData {
  status: string;
  order: Order;
}

const handleEditOrderStatus = async (req: Req, res: express.Response) => {
  const { order, status }: UpdateOrderStatusData = req.body;

  await getConnection()
    .query(
      `
      UPDATE public."order" SET status = $1 WHERE id = $2;
      `,
      [status, order.id]
    )
    .catch((err) => {
      return res.json({ error: err.code });
    });

  if (status === "canceled") {
    order.orderItems.forEach(async (item) => {
      await getConnection()
        .query(
          `
        update variation set stock = stock + $1 where variation.sku = $2
        `,
          [item.quantity, item.variationSku]
        )
        .catch((err) => {
          return res.json({ error: err.code });
        });
    });
  }

  return res.json(true);
};

export default handleEditOrderStatus;
