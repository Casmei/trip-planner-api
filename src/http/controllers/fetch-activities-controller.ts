import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeFetchActivitiesUseCase } from "../../use-cases/factories/make-fetch-activities-use-case";
import { errorMap } from "../error-map";

export async function fetchActivities(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createActivityParamsSchema = z.object({
    tripId: z.uuid(),
  });

  const { tripId } = createActivityParamsSchema.parse(request.params);
  const useCase = makeFetchActivitiesUseCase();

  try {
    const { activities } = await useCase.execute({
      trip_id: tripId,
    });

    return reply.status(StatusCodes.OK).send(activities);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
