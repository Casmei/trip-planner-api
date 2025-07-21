import type { FastifyInstance } from "fastify";
import { confirmTrip } from "./controllers/confirm-trip-controller";
import { createTrip } from "./controllers/create-trip-controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/trips", createTrip);
  app.get("/trips/:tripId/confirm", confirmTrip);
}
