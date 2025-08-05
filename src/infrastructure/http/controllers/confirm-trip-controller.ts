import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../../config/env";
import { makeConfirmTripUseCase } from "../../../core/use-cases/factories/make-confirm-trip-use-case";
import { errorMap } from "../error-map";
import type { ConfirmTripParams } from "../schemas/trip";

export async function confirmTrip(
  request: FastifyRequest<{ Params: ConfirmTripParams }>,
  reply: FastifyReply,
) {
  const { tripId } = request.params;
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
