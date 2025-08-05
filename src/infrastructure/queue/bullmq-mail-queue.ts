import type {
  MailQueue,
  sendTripConfirmationMailProp,
  sendTripParticipantsConfirmationMailProp,
} from "../../core/contracts/mail-queue-interface";
import { queues } from "./queue";

export class BullMQMailQueue implements MailQueue {
  async sendTripConfirmationMail(data: sendTripConfirmationMailProp) {
    queues.tripCreated.add("trip:created", data);
  }

  async sendTripParticipantsConfirmationMail(
    data: sendTripParticipantsConfirmationMailProp,
  ) {
    if (!data.participants || data.participants.length === 0) {
      return;
    }

    await Promise.all(
      data.participants.map((participant) => {
        queues.tripCreated.add("trip:created", {
          participant,
          trip: data.trip,
        });
      }),
    );
  }
}
