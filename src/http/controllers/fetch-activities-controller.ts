import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeFetchActivitiesUseCase } from "../../use-cases/factories/make-fetch-activities-use-case";
import { errorMap } from "../error-map";
import type { FetchActivitiesParams } from "../schemas/activity";

export async function fetchActivities(
  request: FastifyRequest<{ Params: FetchActivitiesParams }>,
  reply: FastifyReply,
) {
  const { tripId } = request.params;
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
