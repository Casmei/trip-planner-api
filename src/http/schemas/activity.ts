import { z } from "zod";

export const activitySchema = z.object({
  id: z.uuid(),
  trip_id: z.uuid(),
  title: z.string().nullable(),
  occurs_at: z.date(),
});

export const activityGroupByDateSchema = z.object({
  date: z.date(),
  activities: z.array(activitySchema),
});

export const fetchActivitiesResponseSchema = z.array(activityGroupByDateSchema);

export const fetchActivitiesParamsSchema = z.object({
  tripId: z.uuid(),
});

export const createActivityParamsSchema = z.object({
  tripId: z.uuid(),
});

export const createActivityBodySchema = z.object({
  title: z.string().min(4),
  occurs_at: z.coerce.date(),
});

export type CreateActivityParams = z.infer<typeof createActivityParamsSchema>;
export type CreateActivityBody = z.infer<typeof createActivityBodySchema>;
export type FetchActivitiesParams = z.infer<typeof fetchActivitiesParamsSchema>;
