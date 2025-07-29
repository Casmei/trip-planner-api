import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeGetTripDetailsUseCase } from "../../use-cases/factories/make-get-trip-details-use-case";
import { errorMap } from "../error-map";

export async function getTripDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTripDetailsParamSchema = z.object({
    tripId: z.uuid(),
  });

  const { tripId } = getTripDetailsParamSchema.parse(request.params);
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
