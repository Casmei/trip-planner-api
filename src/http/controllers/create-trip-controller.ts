import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateTripUseCase } from "../../use-cases/factories/make-create-trip-use-case";

export async function createTrip(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    destination: z.string().min(4),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    owner_name: z.string(),
    owner_email: z.email(),
    emails_to_invite: z.array(z.email()),
  });

  const {
    destination,
    starts_at,
    ends_at,
    owner_name,
    owner_email,
    emails_to_invite,
  } = registerBodySchema.parse(request.body);

  const createTripUseCase = makeCreateTripUseCase();
  await createTripUseCase.execute({
    destination,
    ends_at,
    starts_at,
    owner_name,
    owner_email,
    emails_to_invite,
  });
}
