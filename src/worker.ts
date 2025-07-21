import "dotenv/config";
import { Worker } from "bullmq";
import { jobRegistry } from "./jobs/job-registry";
import { QUEUE_TOKENS } from "./jobs/tokens";
import { redis } from "./libs/redis";

const worker = new Worker(
  QUEUE_TOKENS.MAIL_QUEUE,
  async (job) => {
    const handler = jobRegistry[job.name];
    if (!handler) {
      console.warn(`⚠️ Nenhum handler para job "${job.name}"`);
      return;
    }

    await handler(job);
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} (${job.name}) completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} (${job?.name}) failed:`, err);
});
