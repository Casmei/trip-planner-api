import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeCreateLinkUseCase } from "../../use-cases/factories/make-create-link-use-case";
import { errorMap } from "../error-map";

export async function createLink(request: FastifyRequest, reply: FastifyReply) {
  const createLinkBodySchema = z.object({
    title: z.string().min(4),
    url: z.url(),
  });

  const createActivityParamsSchema = z.object({
    tripId: z.uuid(),
  });

  const { url, title } = createLinkBodySchema.parse(request.body);
  const { tripId } = createActivityParamsSchema.parse(request.params);

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
