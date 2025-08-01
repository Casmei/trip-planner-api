import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { makeCreateTripUseCase } from "../../use-cases/factories/make-create-trip-use-case";
import { errorMap } from "../error-map";
import type { CreateTripInput } from "../schemas/trip";

export async function createTrip(
  request: FastifyRequest<{ Body: CreateTripInput }>,
  reply: FastifyReply,
) {
  const {
    destination,
    starts_at,
    ends_at,
    owner_name,
    owner_email,
    emails_to_invite,
  } = request.body;

  const createTripUseCase = makeCreateTripUseCase();

  try {
    await createTripUseCase.execute({
      destination,
      ends_at,
      starts_at,
      owner_name,
      owner_email,
      emails_to_invite,
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
