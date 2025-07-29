import type { FastifyInstance } from "fastify";
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

export async function routes(app: FastifyInstance) {
  //TRIP
  app.post("/trips", createTrip);
  app.patch("/trips/:tripId", updateTrip);
  app.get("/trips/:tripId/confirm", confirmTrip);
  app.get("/trips/:tripId", getTripDetails);
  app.post("/trips/:tripId/invites", createInvite);

  //ACTIVITY
  app.get("/trips/:tripId/activities", fetchActivities);
  app.post("/trips/:tripId/activities", createActivity);

  //LINK
  app.get("/trips/:tripId/links", fetchLinks);
  app.post("/trips/:tripId/links", createLink);

  //PARTICIPANT
  app.get("/participants/:participantId/confirm", confirmParticipant);
  app.get("/trips/:tripId/participants/:participantId", getParticipant);
  app.get("/trips/:tripId/participants", fetchParticipants);
}
