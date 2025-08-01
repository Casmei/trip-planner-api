import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeGetParticipantUseCase } from "../../use-cases/factories/make-get-participant-use-case";
import { errorMap } from "../error-map";
import type { GetParticipantParams } from "../schemas/participant";

export async function getParticipant(
  request: FastifyRequest<{ Params: GetParticipantParams }>,
  reply: FastifyReply,
) {
  const { participantId, tripId } = request.params;
  const useCase = makeGetParticipantUseCase();

  try {
    const { participant } = await useCase.execute({ participantId, tripId });

    return reply.status(StatusCodes.OK).send(participant);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
