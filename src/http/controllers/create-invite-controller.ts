import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeCreateInviteUseCase } from "../../use-cases/factories/make-create-invite-use-case";
import { errorMap } from "../error-map";

export async function createInvite(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createInviteParamSchema = z.object({
    tripId: z.uuid(),
  });

  const createInviteBodySchema = z.object({
    email: z.email(),
  });

  const { tripId } = createInviteParamSchema.parse(request.params);
  const { email } = createInviteBodySchema.parse(request.body);

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
