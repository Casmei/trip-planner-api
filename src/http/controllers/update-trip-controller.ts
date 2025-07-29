import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeUpdateTripUseCase } from "../../use-cases/factories/make-update-trip-use-case";
import { errorMap } from "../error-map";

export async function updateTrip(request: FastifyRequest, reply: FastifyReply) {
  const updateTripBodySchema = z.object({
    destination: z.string().min(4),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
  });

  const updateTripParamSchema = z.object({
    tripId: z.uuid(),
  });

  const { destination, starts_at, ends_at } = updateTripBodySchema.parse(
    request.body,
  );

  const { tripId } = updateTripParamSchema.parse(request.params);
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
