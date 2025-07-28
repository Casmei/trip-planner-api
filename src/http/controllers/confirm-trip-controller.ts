import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { env } from "../../config/env";
import { ResourceNotFoundError } from "../../use-cases/errors/resource-not-found-error";
import { makeConfirmTripUseCase } from "../../use-cases/factories/make-confirm-trip-use-case";
import { errorMap } from "./error-map";

export async function confirmTrip(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerParamSchema = z.object({
    tripId: z.uuid(),
  });

  const { tripId } = registerParamSchema.parse(request.params);

  const confirmTripUseCase = makeConfirmTripUseCase();

  try {
    await confirmTripUseCase.execute({ tripId });

    return reply.redirect(
      `${env.FRONT_HOST}:${env.FRONT_PORT}/trips/${tripId}`,
    );
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
