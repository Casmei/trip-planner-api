import { Queue } from "bullmq";
import type { Participant, Trip } from "../generated/prisma";
import { redis } from "../libs/redis";
import type { MailQueue } from "./mail-queue-interface";
import { JOB_TOKENS, QUEUE_TOKENS } from "./tokens";

export class BullMQMailQueue implements MailQueue {
  private queue = new Queue(QUEUE_TOKENS.MAIL_QUEUE, {
    connection: redis,
  });

  async sendTripConfirmationMail(data: {
    tripId: string;
    destination: string;
    starts_at: Date;
    ends_at: Date;
    owner_name: string;
    owner_email: string;
  }) {
    await this.queue.add(JOB_TOKENS.SEND_CONFIRMATION_MAIL, data);
  }

  async sendTripParticipantsConfirmationMail(data: {
    participants: Participant[] | null;
    trip: Trip;
  }) {
    if (!data.participants || data.participants.length === 0) {
      return;
    }
    await Promise.all(
      data.participants.map((participant) => {
        this.queue.add(JOB_TOKENS.SEND_PARTICIPANT_CONFIRMATION_MAIL, {
          participant,
          trip: data.trip,
        });
      }),
    );
  }
}
