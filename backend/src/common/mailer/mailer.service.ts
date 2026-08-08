import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

export interface EnviarCorreoOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async enviarCorreo(options: EnviarCorreoOptions): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
      this.logger.warn('SENDGRID_API_KEY/EMAIL_FROM no configurados; no se envió el correo.');
      return false;
    }

    try {
      await sgMail.send({
        to: options.to,
        from: { email: process.env.EMAIL_FROM, name: 'VEZZI' },
        subject: options.subject,
        html: options.html,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content.toString('base64'),
          type: attachment.contentType,
          disposition: 'attachment',
        })),
      });
      this.logger.log(`Correo enviado a ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando correo a ${options.to}: ${(error as Error).message}`);
      return false;
    }
  }
}
