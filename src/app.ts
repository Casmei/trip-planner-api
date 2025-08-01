import fastify from "fastify";
import "dotenv/config";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import scalarDocs from "@scalar/fastify-api-reference";
import fastifyFavicon from "fastify-favicon";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import path from "path";
import { ZodError } from "zod";
import { env } from "./config/env";
import { routes } from "./http/routes";

export const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Trip Planner",
      description:
        "A simple API for creating trips, inviting participants, and organizing travel activities.",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${env.API_PORT}/api`,
      },
      {
        url: "https://api.example.com/api",
      },
    ],
    tags: [
      {
        name: "Trip",
        description:
          "Operations related to trip planning, including creation, updates, confirmation, and participant invites.",
      },
      {
        name: "Activity",
        description:
          "APIs to create and manage daily activities associated with a trip, grouped and retrieved by date.",
      },
      {
        name: "Link",
        description:
          "Endpoints for managing shared or related links within a trip, such as travel resources or planning documents.",
      },
      {
        name: "Participant",
        description:
          "APIs that handle participant confirmation, access, and trip-related interactions for invited users.",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(scalarDocs, {
  routePrefix: "/api/docs",
  configuration: {
    hideModels: true,
    pageTitle: "Api Documentation - Trip Planner",
    title: "Trip Planner",
    theme: "elysiajs",
  },
});

app.register(routes, { prefix: "/api" });

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
