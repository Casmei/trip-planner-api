import type { Job } from "bullmq";
import nodemailer from "nodemailer";
import { env } from "../../../config/env";
import type { sendTripConfirmationMailProp } from "../../../core/contracts/mail-queue-interface";
import { getMailClient } from "../../../libs/mail";
import { formatDatePtBr } from "../../../utils/format-date-pt-br";
import type { Participant, Trip } from "../../database/generated/prisma";
import { createWorker, QUEUE_NAMES } from "../queue";

createWorker(
  QUEUE_NAMES.TRIP_CREATED,
  async (job: Job<sendTripConfirmationMailProp>) => {
    const { tripId, destination, ends_at, starts_at, owner_email, owner_name } =
      job.data;

    const formattedStartDate = formatDatePtBr(new Date(starts_at));
    const formattedEndDate = formatDatePtBr(new Date(ends_at));

    const confirmationLink = `${env.API_HOST}:${env.API_PORT}/trips/${tripId}/confirm`;

    const mail = await getMailClient();

    const message = await mail.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "oi@plann.er",
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: `Confirme sua viagem para ${destination} 🧳`,
      html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
            <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> de
              <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.
            </p>
            <p><a href="${confirmationLink}">Confirmar viagem</a></p>
            <p>Se não foi você, apenas ignore este e-mail.</p>
          </div>
        `.trim(),
    });

    console.log(`Email sent: ${nodemailer.getTestMessageUrl(message)}`);
  },
);

createWorker(
  QUEUE_NAMES.TRIP_CONFIRMED,
  async (job: Job<{ participant: Participant; trip: Trip }>) => {
    const { participant, trip } = job.data;

    const formattedStartDate = formatDatePtBr(new Date(trip.starts_at));
    const formattedEndDate = formatDatePtBr(new Date(trip.ends_at));

    const confirmationLink = `${env.API_HOST}:${env.API_PORT}/trips/${trip.id}/confirm/${participant.id}`;

    const mail = await getMailClient();

    const message = await mail.sendMail({
      from: {
        name: "Equipe plann.er",
        address: "oi@plann.er",
      },
      to: participant.email,
      subject: `Confirme sua presença na viagem para ${trip.destination} 🧳`,
      html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
            <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> de
              <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.
            </p>
            <p></p>
            <p>Para confirmar sua presença na viagem, clique no link a baixo:</p>
            <p></p>
            <p><a href="${confirmationLink}">Confirmar viagem</a></p>
            <p></p>
            <p>Se não foi você, apenas ignore este e-mail.</p>
          </div>
        `.trim(),
    });

    console.log(`Email sent: ${nodemailer.getTestMessageUrl(message)}`);
  },
);
