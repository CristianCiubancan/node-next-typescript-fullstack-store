declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL: string;
      DATABASE_HOST: string;
      REDIS_HOST: string;
      DATABASE_PASSWORD: string;
      DATABASE_DB: string;
      DATABASE_USER: string;
      REDIS_CLUSTER_URLS: string;
      SERVER_PORT: string;
      SESSION_SECRET: string;
      CORS_ORIGIN_CLIENT: string;
      CORS_ORIGIN_ADMIN: string;
      EMAIL_PORT: string;
      EMAIL_HOST: string;
      EMAIL_ADDRESS: string;
      OWNER_EMAIL_ADDRESS: string;
      EMAIL_PASSWORD: string;
      AWS_BUCKET_NAME: string;
      AWS_BUCKET_REGION: string;
      AWS_ACCESS_KEY: string;
      AWS_SECRET_KEY: string;
      STRIPE_KEY: string;
    }
  }
}

export {}
