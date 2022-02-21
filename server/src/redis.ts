import Redis, { ClusterNode } from "ioredis";

export const buildRedisClient = () => {
  try {
    // cluster URLs should be passed in with the following format:
    // REDIS_CLUSTER_URLS=10.0.0.1:6379,10.0.0.2:6379,10.0.0.3:6379
    const nodes: ClusterNode[] = process.env.REDIS_CLUSTER_URLS.split(",").map(
      (url) => {
        const [host, port] = url.split(":");
        return { host, port: parseInt(port) };
      }
    );

    const client = new Redis.Cluster(nodes, {
      redisOptions: {
        enableAutoPipelining: true,
      },
    });

    client.on("error", (error) => {
      console.error("Redis Error", error);
    });

    // Redis emits this error when an something
    // occurs when connecting to a node when using Redis in Cluster mode
    client.on("node error", (error, node) => {
      console.error(`Redis error in node ${node}`, error);
    });

    return client;
  } catch (error) {
    console.error("Could not create a Redis cluster client", error);

    return undefined;
  }
};
