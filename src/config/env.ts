import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  API_PORT: num({ default: 3000 }),
  API_HOST: str({ default: "http://localhost" }),
  NODE_ENV: str({ choices: ["development", "production"] }),
});
