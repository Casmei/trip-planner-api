import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeUpdateTripUseCase } from "../../use-cases/factories/make-update-trip-use-case";
import { errorMap } from "../error-map";
import type { UpdateTripBody, UpdateTripParams } from "../schemas/trip";

export async function updateTrip(
  request: FastifyRequest<{
    Params: UpdateTripParams;
    Body: UpdateTripBody;
  }>,
  reply: FastifyReply,
) {
  const { destination, starts_at, ends_at } = request.body;
  const { tripId } = request.params;

  const updateTripUseCase = makeUpdateTripUseCase();

  try {
    await updateTripUseCase.execute({
      destination,
      ends_at,
      starts_at,
      trip_id: tripId,
    });

    return reply.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
