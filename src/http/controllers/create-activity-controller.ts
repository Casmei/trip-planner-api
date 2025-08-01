import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeCreateActivityUseCase } from "../../use-cases/factories/make-create-activity-use-case";
import { errorMap } from "../error-map";
import type {
  CreateActivityBody,
  CreateActivityParams,
} from "../schemas/activity";

export async function createActivity(
  request: FastifyRequest<{
    Params: CreateActivityParams;
    Body: CreateActivityBody;
  }>,
  reply: FastifyReply,
) {
  const { occurs_at, title } = request.body;
  const { tripId } = request.params;
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
