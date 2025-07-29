import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeCreateActivityUseCase } from "../../use-cases/factories/make-create-activity-use-case";
import { errorMap } from "../error-map";

export async function createActivity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createActivityBodySchema = z.object({
    title: z.string().min(4),
    occurs_at: z.coerce.date(),
  });

  const createActivityParamsSchema = z.object({
    tripId: z.uuid(),
  });

  const { occurs_at, title } = createActivityBodySchema.parse(request.body);
  const { tripId } = createActivityParamsSchema.parse(request.params);

  const useCase = makeCreateActivityUseCase();

  try {
    await useCase.execute({
      occurs_at,
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
