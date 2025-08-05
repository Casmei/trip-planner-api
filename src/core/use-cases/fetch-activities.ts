import dayjs from "dayjs";
import type { Activity } from "../../infrastructure/database/generated/prisma";
import type { ActivitiesRepository } from "../repositories/activities-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchActivitiesUseCaseRequest {
  trip_id: string;
}

type FetchActivitiesUseCaseResponse = {
  activities: { date: Date; activities: Activity[] }[];
};

export class FetchActivitiesUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private activitiesRepository: ActivitiesRepository,
  ) {}

  async execute({
    trip_id,
  }: FetchActivitiesUseCaseRequest): Promise<FetchActivitiesUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const activities =
      await this.activitiesRepository.findManyByTripId(trip_id);

    const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
      trip.starts_at,
      "days",
    );

    const formattedActivities = Array.from({
      length: differenceInDaysBetweenTripStartAndEnd + 1,
    }).map((_, index) => {
      const date = dayjs(trip.starts_at).add(index, "days");

      return {
        date: date.toDate(),
        activities: activities.filter((activity) => {
          return dayjs(activity.occurs_at).isSame(date, "day");
        }),
      };
    });

    return { activities: formattedActivities };
  }
}
