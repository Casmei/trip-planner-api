import type {
  Participant,
  Trip,
} from "../../infrastructure/database/generated/prisma";

export type sendTripConfirmationMailProp = {
  tripId: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
  owner_name: string;
  owner_email: string;
};

export type sendTripParticipantsConfirmationMailProp = {
  participants: Participant[] | null;
  trip: Trip;
};

export interface MailQueue {
  sendTripConfirmationMail(data: sendTripConfirmationMailProp): Promise<void>;

  sendTripParticipantsConfirmationMail(
    data: sendTripParticipantsConfirmationMailProp,
  ): Promise<void>;
}
