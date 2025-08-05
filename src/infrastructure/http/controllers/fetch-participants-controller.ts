import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeFetchParticipantsUseCase } from "../../../core/use-cases/factories/make-fetch-participants-use-case";
import { errorMap } from "../error-map";
import type { FetchParticipantsParams } from "../schemas/participant";

export async function fetchParticipants(
  request: FastifyRequest<{ Params: FetchParticipantsParams }>,
  reply: FastifyReply,
) {
  const { tripId } = request.params;
  const useCase = makeFetchParticipantsUseCase();

  try {
    const { participants } = await useCase.execute({ trip_id: tripId });

    return reply.status(StatusCodes.OK).send(participants);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
