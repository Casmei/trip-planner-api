import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeFetchLinksUseCase } from "../../use-cases/factories/make-fetch-links-use-case";
import { errorMap } from "../error-map";

export async function fetchLinks(request: FastifyRequest, reply: FastifyReply) {
  const fetchLinksParamsSchema = z.object({
    tripId: z.uuid(),
  });

  const { tripId } = fetchLinksParamsSchema.parse(request.params);
  const useCase = makeFetchLinksUseCase();

  try {
    const { links } = await useCase.execute({
      trip_id: tripId,
    });

    return reply.status(StatusCodes.OK).send(links);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
