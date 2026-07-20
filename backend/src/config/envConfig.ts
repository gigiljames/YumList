import dotenv from "dotenv";
import { envSchema } from "../validators/envValidator";
import { MESSAGES } from "../constants/messages";
dotenv.config({ path: ".env" });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("**************ENV VALIDATION ERROR***************");
  parsedEnv.error.issues.forEach((issue) => {
    console.error(`${issue.message}`);
  });
  console.error("*************************************************");
  throw new Error(MESSAGES.ENV.INVALID_ENV);
}

export const env = parsedEnv.data;
