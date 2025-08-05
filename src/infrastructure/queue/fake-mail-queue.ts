import type { MailQueue } from "../../core/contracts/mail-queue-interface";

export class FakeMailQueue implements MailQueue {
  async sendTripParticipantsConfirmationMail() {}
  async sendTripConfirmationMail() {
    // não faz nada, apenas satisfaz a interface
  }
}
