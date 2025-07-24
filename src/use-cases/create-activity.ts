import type { Activity } from "../generated/prisma";
import type { ActivitiesRepository } from "../repositories/activities-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { InvalidActivityEndDateError } from "./errors/invalid-activity-end-date-error";
import { InvalidActivityStartDateError } from "./errors/invalid-activity-start-date-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateActivityUseCaseRequest {
  title: string;
  occurs_at: Date;
  trip_id: string;
}

type CreateActivityUseCaseResponse = { activity: Activity };

export class CreateActivityUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private activitiesRepository: ActivitiesRepository,
  ) {}

  async execute({
    title,
    occurs_at,
    trip_id,
  }: CreateActivityUseCaseRequest): Promise<CreateActivityUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    if (occurs_at < trip.starts_at) {
      throw new InvalidActivityStartDateError();
    }

    if (occurs_at > trip.ends_at) {
      throw new InvalidActivityEndDateError();
    }

    const activity = await this.activitiesRepository.create({
      title,
      occurs_at,
      trip_id,
    });

    return { activity };
  }
}
