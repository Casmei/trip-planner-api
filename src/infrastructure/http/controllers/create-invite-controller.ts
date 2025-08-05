import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeCreateInviteUseCase } from "../../../core/use-cases/factories/make-create-invite-use-case";
import { errorMap } from "../error-map";
import type { CreateInviteBody, CreateInviteParams } from "../schemas/trip";

export async function createInvite(
  request: FastifyRequest<{
    Params: CreateInviteParams;
    Body: CreateInviteBody;
  }>,
  reply: FastifyReply,
) {
  const { tripId } = request.params;
  const { email } = request.body;
  const useCase = makeCreateInviteUseCase();

  try {
    await useCase.execute({ tripId, participantEmail: email });
    return reply.status(StatusCodes.CREATED).send();
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
