import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  API_PORT: num({ default: 3000 }),
  API_HOST: str({ default: "http://localhost" }),
  FRONT_PORT: num({ default: 3001 }),
  FRONT_HOST: str({ default: "http://localhost" }),
  NODE_ENV: str({ choices: ["development", "production"] }),
  DATABASE_URL: str({
    default: "postgresql://calidade:calidade@localhost:5482/trip-planner",
  }),
  REDIS_HOST: str({ default: "localhost" }),
  REDIS_PORT: num({ default: 6379 }),
});
