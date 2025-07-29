import type { FastifyInstance } from "fastify";
import { confirmTrip } from "./controllers/confirm-trip-controller";
import { createTrip } from "./controllers/create-trip-controller";
import { getTripDetails } from "./controllers/get-trip-details-controller";
import { updateTrip } from "./controllers/update-trip-controller";

export async function routes(app: FastifyInstance) {
  //TRIP
  app.post("/trips", createTrip);
  app.patch("/trips/:tripId", updateTrip);
  app.get("/trips/:tripId/confirm", confirmTrip);
  app.get("/trips/:tripId", getTripDetails);
}
