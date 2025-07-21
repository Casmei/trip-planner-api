import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeConfirmTripUseCase } from "../../use-cases/factories/make-confirm-trip-use-case";

export async function confirmTrip(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerParamSchema = z.object({
    tripId: z.uuid(),
  });

  const { tripId } = registerParamSchema.parse(request.params);

  const confirmTripUseCase = makeConfirmTripUseCase();
  await confirmTripUseCase.execute({ tripId });

  return reply.redirect(`http://localhost:3000/trips/${tripId}`);
}
