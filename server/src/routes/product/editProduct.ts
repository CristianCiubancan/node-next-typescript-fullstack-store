import express from "express";
import { Product } from "../../entities/Product/Product";
import { insertProduct } from "../../utils/insertProduct";
import { Req } from "../../types/networkingTypes";
import { Product as ProductType } from "../../types/product";
import { findDuplicates } from "../../utils/findDuplicate";

export interface CreateProduct extends ProductType {
  price: string;
}

const handleEditProduct = async (req: Req, res: express.Response) => {
  const body: CreateProduct = req.body;

  //validation

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

  if (!body.name || !body.price || !body.description) {
    return res.json({
      error: "Product general info must be filled",
    });
  }

  if (!body.id) {
    return res.json({
      error: "Product general info must be filled",
    });
  }

  if (body.images.length === 0) {
    return res.json({
      error: "Any product must have at least one image to display",
    });
  }

  if (body.attributes.length > 0) {
    let duplicateValues: any[] = [];

    body.attributes
      .map((attr) => attr.values.map((value) => value.name))
      .map((valuesArray) => {
        if (findDuplicates(valuesArray)) {
          duplicateValues.push(true);
        }
      });

    if (body.variations.length === 0) {
      return res.json({
        error: "A product with attributes must also have variations ",
      });
    } else if (findDuplicates(body.attributes.map((attr) => attr.name))) {
      return res.json({
        error: "Different attributes cannot have the same name",
      });
    } else if (duplicateValues.length > 0) {
      return res.json({
        error:
          "Different values of the same attribute cannot have the same name",
      });
    }
  }

  await Product.delete(body.id).catch((err) => {
    return res.json({ error: err.code });
  });

  let product;
  try {
    product = await insertProduct(body);
  } catch (err) {
    return res.json({ error: err.message });
  }

  return res.json(product);
};

export default handleEditProduct;
