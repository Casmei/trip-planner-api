import fastify from "fastify";
import "dotenv/config";
import { ZodError } from "zod";
import { env } from "./config/env";
import { tripRoutes } from "./http/trip-routes";

export const app = fastify();
app.register(tripRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    //todo: Adicionar um Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
