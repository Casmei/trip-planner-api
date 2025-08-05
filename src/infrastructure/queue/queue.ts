import { Queue, Worker } from "bullmq";
import { redis } from "../../libs/redis";

const connection = redis;

export const QUEUE_NAMES = {
  TRIP_CREATED: "trip.created",
  TRIP_CONFIRMED: "trip.confirmed",
} as const;

export const createQueue = (name: string) => {
  return new Queue(name, { connection });
};

export const createWorker = (name: string, processor: any) => {
  return new Worker(name, processor, { connection });
};

export const queues = {
  tripCreated: createQueue(QUEUE_NAMES.TRIP_CREATED),
  tripConfirmed: createQueue(QUEUE_NAMES.TRIP_CONFIRMED),
};
