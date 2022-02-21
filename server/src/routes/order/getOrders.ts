import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";

const handleGerOrders = async (req: Req, res: express.Response) => {
  const { orderStatus } = req.params;

  if (!req.session.userId) {
    return res.json({
      error: "Your session expired, please relog",
    });
  }

  if (!req.session.isAdmin) {
    return res.json({
      error:
        "You are not authorized for this action, plase contact your supervisor",
    });
  }

  const orders = await getConnection()
    .query(
      `SELECT
      o.*,
      jsonb_agg(jsonb_build_object(
        'productName',
        p.name,
        'variationName',
        v.name,
        'quantity',
        oi.quantity,
        'variationSku',
        v.sku,
        'productSku',
        p.sku,
        'price',
        v.price,
        'discountMultiplier',
        v."discountMultiplier",
        'images',
        ARRAY(
        select jsonb_build_object(
          'id',
            i.id,
            'name',
            i.name,
            'placeholderUrl',
            i."placeholderUrl",
            'url',
            i.url
        )
        from product_image pi join image i on i.id = pi."imageId" where pi."productId" = p.id
        )
      )) as "orderItems"
    FROM
      public."order" o
      join order_item oi on oi."orderId" = o.id
      join variation v on oi."variationSku" = v.sku
      join product p on oi."productSku" = p.sku
      where
  o.status = $1
      group by o.id
`,
      [orderStatus]
    )
    .catch((err) => {
      return res.json({ error: err.code });
    });

  return res.json(orders);
};

export default handleGerOrders;
