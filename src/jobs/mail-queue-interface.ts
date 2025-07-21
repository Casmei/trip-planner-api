import type { Participant, Trip } from "../generated/prisma";

export interface MailQueue {
  sendTripConfirmationMail(data: {
    tripId: string;
    destination: string;
    starts_at: Date;
    ends_at: Date;
    owner_name: string;
    owner_email: string;
  }): Promise<void>;

  sendTripParticipantsConfirmationMail(data: {
    participants: Participant[] | null;
    trip: Trip;
  }): Promise<void>;
}
