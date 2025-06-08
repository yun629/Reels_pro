import { Connection } from "mongoose";

declare module 'daisyui';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
  
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URL: string;
      NEXT_AUTH_SECRET: string;
      NEXT_PUBLIC_PUBLIC_KEY: string;
      PRIVATE_KEY: string;
      NEXT_PUBLIC_URL_ENDPOINT: string;
    }
  }
}

export {}
