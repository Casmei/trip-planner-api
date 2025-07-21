import type { Job } from "bullmq";
import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { getMailClient } from "../../libs/mail";
import { formatDatePtBr } from "../../utils/format-date-pt-br";

type MailJobData = {
  tripId: string;
  destination: string;
  starts_at: Date;
  ends_at: Date;
  owner_name: string;
  owner_email: string;
};

export async function sendConfirmationMail(job: Job<MailJobData>) {
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
}
