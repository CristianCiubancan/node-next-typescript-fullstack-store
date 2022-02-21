import { Cluster, Redis } from "ioredis";
import { v4 } from "uuid";

export const createConfirmationUrl = async (
  userId: string,
  redisClient: Redis | Cluster
) => {
  const id = v4();
  await redisClient.set(id, userId, "ex", 60 * 60 * 24);

  return id;
};
