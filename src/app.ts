import fastify from "fastify";
import "dotenv/config";
import { appRoutes } from "./http/routes";

export const app = fastify();
app.register(appRoutes);
