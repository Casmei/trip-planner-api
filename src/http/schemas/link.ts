import { z } from "zod";

export const fetchLinksParamsSchema = z.object({
  tripId: z.uuid(),
});

export const linkSchema = z.object({
  id: z.uuid(),
  trip_id: z.uuid(),
  url: z.url(),
  title: z.string().nullable(),
});

export const fetchLinksResponseSchema = z.array(linkSchema);

export const createLinkParamsSchema = z.object({
  tripId: z.uuid(),
});

export const createLinkBodySchema = z.object({
  title: z.string().min(4),
  url: z.url(),
});

export type CreateLinkParams = z.infer<typeof createLinkParamsSchema>;
export type CreateLinkBody = z.infer<typeof createLinkBodySchema>;
export type FetchLinksParams = z.infer<typeof fetchLinksParamsSchema>;
export type Link = z.infer<typeof linkSchema>;
