import express from "express";
import { Req } from "../../types/networkingTypes";
import { Image } from "../../entities/Image/Image";

const handleGetImages = async (_req: Req, res: express.Response) => {
  const images = await Image.find({
    relations: ["sizes"],
    order: { createdAt: "DESC" },
  });

  return res.json(images);
};

export default handleGetImages;
