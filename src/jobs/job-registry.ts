import type { Job } from "bullmq";
import { sendConfirmationMail } from "./processors/send-confirmation-mail";
import { sendParticipantConfirmationMail } from "./processors/send-participant-confirmation-mail";
import { JOB_TOKENS } from "./tokens";

type JobHandler = (job: Job) => Promise<void>;

export const jobRegistry: Record<string, JobHandler> = {
  [JOB_TOKENS.SEND_CONFIRMATION_MAIL]: sendConfirmationMail,
  [JOB_TOKENS.SEND_PARTICIPANT_CONFIRMATION_MAIL]:
    sendParticipantConfirmationMail,
};
