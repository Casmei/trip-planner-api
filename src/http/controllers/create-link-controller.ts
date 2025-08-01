import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeCreateLinkUseCase } from "../../use-cases/factories/make-create-link-use-case";
import { errorMap } from "../error-map";
import type { CreateLinkBody, CreateLinkParams } from "../schemas/link";

export async function createLink(
  request: FastifyRequest<{
    Params: CreateLinkParams;
    Body: CreateLinkBody;
  }>,
  reply: FastifyReply,
) {
  const { url, title } = request.body;
  const { tripId } = request.params;

  const useCase = makeCreateLinkUseCase();

  try {
    await useCase.execute({
      url,
      title,
      trip_id: tripId,
    });

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
