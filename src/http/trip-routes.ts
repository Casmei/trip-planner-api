import type { FastifyInstance } from "fastify";
import { confirmTrip } from "./controllers/confirm-trip-controller";
import { createTrip } from "./controllers/create-trip-controller";
import { updateTrip } from "./controllers/update-trip-controller";

export async function tripRoutes(app: FastifyInstance) {
  app.post("/trips", createTrip);
  app.patch("/trips/:tripId", updateTrip);
  app.get("/trips/:tripId/confirm", confirmTrip);
}
