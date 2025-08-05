import type { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../libs/prisma";
import { redis } from "../../libs/redis";
import { confirmParticipant } from "./controllers/confirm-participant-controller";
import { confirmTrip } from "./controllers/confirm-trip-controller";
import { createActivity } from "./controllers/create-activity-controller";
import { createInvite } from "./controllers/create-invite-controller";
import { createLink } from "./controllers/create-link-controller";
import { createTrip } from "./controllers/create-trip-controller";
import { fetchActivities } from "./controllers/fetch-activities-controller";
import { fetchLinks } from "./controllers/fetch-links-controller";
import { fetchParticipants } from "./controllers/fetch-participants-controller";
import { getParticipant } from "./controllers/get-participant-controller";
import { getTripDetails } from "./controllers/get-trip-details-controller";
import { updateTrip } from "./controllers/update-trip-controller";
import {
  createActivityBodySchema,
  createActivityParamsSchema,
  fetchActivitiesParamsSchema,
  fetchActivitiesResponseSchema,
} from "./schemas/activity";
import {
  createLinkBodySchema,
  createLinkParamsSchema,
  fetchLinksParamsSchema,
  fetchLinksResponseSchema,
} from "./schemas/link";
import {
  confirmParticipantParamsSchema,
  fetchParticipantsParamsSchema,
  fetchParticipantsResponseSchema,
  getParticipantParamsSchema,
  participantSchema,
} from "./schemas/participant";
import {
  confirmTripParamsSchema,
  createInviteBodySchema,
  createInviteParamsSchema,
  createTripSchema,
  getTripDetailsParamsSchema,
  tripSchema,
  updateTripBodySchema,
  updateTripParamsSchema,
} from "./schemas/trip";

export async function routes(app: FastifyInstance) {
  app.post(
    "/trips",
    {
      schema: {
        tags: ["Trip"],
        body: createTripSchema,
        response: {
          201: z.null(),
        },
      },
    },
    createTrip,
  );

  app.patch(
    "/trips/:tripId",
    {
      schema: {
        tags: ["Trip"],
        params: updateTripParamsSchema,
        body: updateTripBodySchema,
        response: {
          204: z.null(),
        },
      },
    },
    updateTrip,
  );

  app.get(
    "/trips/:tripId",
    {
      schema: {
        tags: ["Trip"],
        params: getTripDetailsParamsSchema,
        response: {
          200: tripSchema,
        },
      },
    },
    getTripDetails,
  );

  app.get(
    "/trips/:tripId/confirm",
    {
      schema: {
        tags: ["Trip"],
        params: confirmTripParamsSchema,
        response: {
          302: z.null(),
        },
      },
    },
    confirmTrip,
  );

  app.post(
    "/trips/:tripId/invites",
    {
      schema: {
        tags: ["Trip"],
        params: createInviteParamsSchema,
        body: createInviteBodySchema,
        response: {
          201: z.null(), // resposta vazia
        },
      },
    },
    createInvite,
  );

  app.get(
    "/trips/:tripId/activities",
    {
      schema: {
        tags: ["Activity"],
        params: fetchActivitiesParamsSchema,
        response: {
          200: fetchActivitiesResponseSchema,
        },
      },
    },
    fetchActivities,
  );
  app.post(
    "/trips/:tripId/activities",
    {
      schema: {
        tags: ["Activity"],
        params: createActivityParamsSchema,
        body: createActivityBodySchema,
        response: {
          201: z.null(),
        },
      },
    },
    createActivity,
  );

  app.get(
    "/trips/:tripId/links",
    {
      schema: {
        tags: ["Link"],
        params: fetchLinksParamsSchema,
        response: {
          200: fetchLinksResponseSchema,
        },
      },
    },
    fetchLinks,
  );
  app.post(
    "/trips/:tripId/links",
    {
      schema: {
        tags: ["Link"],
        params: createLinkParamsSchema,
        body: createLinkBodySchema,
        response: {
          201: z.null(),
        },
      },
    },
    createLink,
  );

  //PARTICIPANT
  app.get(
    "/participants/:participantId/confirm",
    {
      schema: {
        tags: ["Participant"],
        params: confirmParticipantParamsSchema,
        response: {
          302: z.null(),
        },
      },
    },
    confirmParticipant,
  );
  app.get(
    "/trips/:tripId/participants/:participantId",
    {
      schema: {
        tags: ["Participant"],
        params: getParticipantParamsSchema,
        response: {
          200: participantSchema,
        },
      },
    },
    getParticipant,
  );
  app.get(
    "/trips/:tripId/participants",
    {
      schema: {
        tags: ["Participant"],
        params: fetchParticipantsParamsSchema,
        response: {
          200: fetchParticipantsResponseSchema,
        },
      },
    },
    fetchParticipants,
  );

  app.get(
    "/helthcheck",
    {
      schema: {
        response: {
          200: z.object({
            status: z.literal("ok"),
            database: z.literal("ok"),
            redis: z.literal("ok"),
          }),
          500: z.object({
            status: z.literal("error"),
            database: z.string(),
            redis: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      let dbStatus = "ok";
      let redisStatus = "ok";

      try {
        await prisma.$connect(); // apenas tenta conectar
      } catch (err) {
        dbStatus = `error: ${err instanceof Error ? err.message : "unknown"}`;
      }

      try {
        await redis.ping();
      } catch (err) {
        redisStatus = `error: ${err instanceof Error ? err.message : "unknown"}`;
      }

      const isHealthy = dbStatus === "ok" && redisStatus === "ok";

      if (isHealthy) {
        return reply.status(200).send({
          status: "ok",
          database: dbStatus,
          redis: redisStatus,
        });
      } else {
        return reply.status(500).send({
          status: "error",
          database: dbStatus,
          redis: redisStatus,
        });
      }
    },
  );
}
