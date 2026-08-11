import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { dbConfig } from "./db.js";
import { jwt } from "better-auth/plugins";

export let auth: any;

const defaultOrigins = [
  "http://localhost:4000",
  "http://backend:3000",
  "http://localhost:5173",
];

export const initAuth = async () => {
  const db = await dbConfig.connect();

  auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [jwt({})],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: (request?: Request) => {
      const origin = request?.headers.get("origin");
      const origins = [...defaultOrigins];
      if (origin && (origin.includes("localhost") || origin.includes(".onrender.com"))) {
        origins.push(origin);
      }
      return origins;
    },
  });
};
