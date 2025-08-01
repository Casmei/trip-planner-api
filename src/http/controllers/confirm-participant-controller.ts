import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../config/env";
import { makeConfirmParticipantUseCase } from "../../use-cases/factories/make-confirm-participant-use-case";
import { errorMap } from "../error-map";
import type { ConfirmParticipantParams } from "../schemas/participant";

export async function confirmParticipant(
  request: FastifyRequest<{ Params: ConfirmParticipantParams }>,
  reply: FastifyReply,
) {
  const { participantId } = request.params;
  const useCase = makeConfirmParticipantUseCase();

  try {
    const { participant } = await useCase.execute({ participantId });

    return reply.redirect(
      `${env.FRONT_HOST}:${env.FRONT_PORT}/trips/${participant.trip_id}`,
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
