import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeGetTripDetailsUseCase } from "../../../core/use-cases/factories/make-get-trip-details-use-case";
import { errorMap } from "../error-map";
import type { GetTripDetailsParams } from "../schemas/trip";

export async function getTripDetails(
  request: FastifyRequest<{ Params: GetTripDetailsParams }>,
  reply: FastifyReply,
) {
  const { tripId } = request.params;
  const getTripDetailsUseCase = makeGetTripDetailsUseCase();

  try {
    const { trip } = await getTripDetailsUseCase.execute({ tripId });
    return reply.status(StatusCodes.OK).send(trip);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
