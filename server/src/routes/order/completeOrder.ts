import express from "express";
import { sendEmail } from "../../utils/sendEmail";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";
import { CartItem, CheckOrderRequestObject } from "../../types/order";
import { sendInvoice } from "../../utils/sendInvoice";
import easyinvoice from "easyinvoice";
import { template } from "../../utils/invoiceTemplate";
import { Order } from "../../entities/Order/Order";
import { OrderItem } from "../../entities/Order/OrderItem";

export interface HalfAvailableItem extends CartItem {
  availableQuantity: number;
}

const handleCompleteOrder = async (req: Req, res: express.Response) => {
  const requestObject: CheckOrderRequestObject = req.body;

  const orderId = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Order)
    .values({
      fullName: requestObject.fullName,
      email: requestObject.email,
      phoneNumber: requestObject.phoneNumber,
      address: requestObject.address,
      zipcode: requestObject.zipcode,
      city: requestObject.city,
      paymentMethod: requestObject.paymentMethod,
      status: "new",
    })
    .returning("*")
    .execute()
    .catch((err) => {
      return res.json({ error: err.code });
    });

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(OrderItem)
    .values(
      requestObject.items.map((item) => {
        return {
          variationSku: item.variationSku,
          productSku: item.productSku,
          quantity: item.quantity,
          orderId: (orderId as any).generatedMaps[0].id,
        };
      })
    )
    .returning("*")
    .execute()
    .catch((err) => {
      return res.json({
        error: err.code,
      });
    });

  requestObject.items.forEach(async (item) => {
    await getConnection()
      .query(
        `
      update variation set stock = stock - $1 where variation.sku = $2
      `,
        [item.quantity, item.variationSku]
      )
      .catch((err) => {
        return res.json({ error: err.code });
      });
  });

  sendEmail(
    process.env.OWNER_EMAIL_ADDRESS,
    "New order received",
    `<div>
    <h1>NEW ORDER RECEIVED YAAAY</h1>
    </div>`
  );

  const pdf = await easyinvoice.createInvoice(
    {
      customize: {
        // btoa === base64 encode
        template: Buffer.from(template, "utf8").toString("base64"), // Your template must be base64 encoded
      },
      sender: {
        company: "Happy Octopus S.R.L",
        address: "Str. Soarelui, nr. 42, bl. 2",
        city: "Ilfov",
        country: "Romania",
      },
      client: {
        address: requestObject.address,
        zip: requestObject.zipcode,
        city: requestObject.city,
      },
      products: requestObject.items.map((item) => {
        return {
          quantity: item.quantity.toString(),
          description: `${item.productName} - ${item.variationName}`,
          price: parseFloat(item.price),
        };
      }),
      settings: {
        currency: "Lei",
      },
    },
    (result) => {
      return result.pdf;
    }
  );

  sendInvoice(
    requestObject.email,
    "Your order details",
    `<div style="dispaly:flex;flex-direction:column;align-items:center;"><h1>Thank you for choosing us!</h1><p>Please find attached your order's details.</p></div>`,
    pdf.pdf
  );

  return res.json(requestObject);
};

export default handleCompleteOrder;
