import express from "express";
import { Cluster, Redis } from "ioredis";
import { User } from "../../entities/User/User";
import { Req } from "../../types/networkingTypes";

const handleConfirmAdmin = async (
  req: Req,
  res: express.Response,
  redisClient: Redis | Cluster
) => {
  const { token } = req.body;

  const userId = await redisClient.get(token);

  if (!userId) {
    return res.json({ message: "Activation token expired", isError: true });
  } else {
    await User.update({ id: parseInt(userId) }, { confirmed: true });
    await redisClient.del(token);
    return res.json({ message: `Admin privilages added`, isError: false });
  }
};

export default handleConfirmAdmin;
