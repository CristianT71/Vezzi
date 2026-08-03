import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EnviarCorreoOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  async enviarCorreo(options: EnviarCorreoOptions): Promise<boolean> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      this.logger.warn('EMAIL_USER/EMAIL_APP_PASSWORD no configurados; no se envió el correo.');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: `"VEZZI" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      });
      this.logger.log(`Correo enviado a ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando correo a ${options.to}: ${(error as Error).message}`);
      return false;
    }
  }
}
