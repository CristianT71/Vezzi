import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Venta } from './entities/venta.entity';

function money(value: string | number): string {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function construirCuerpoCorreo(venta: Venta): string {
  const nombreCliente = venta.cliente?.nombre ?? 'cliente';
  return `<!doctype html>
<html lang="es">
<body style="font-family: Arial, Helvetica, sans-serif; background:#F8FAFC; margin:0; padding:24px 16px;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <div style="background:#0F172A;padding:24px;">
      <h1 style="margin:0;font-size:20px;color:#ffffff;letter-spacing:1px;">VEZZI</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#94A3B8;">Tienda Local</p>
    </div>
    <div style="padding:24px;color:#1E293B;">
      <p style="font-size:14px;">Hola <b>${nombreCliente}</b>,</p>
      <p style="font-size:14px;">¡Gracias por tu compra! Adjuntamos tu factura <b>${venta.numero_venta}</b> por un total de <b>${money(venta.total)}</b>.</p>
      <p style="font-size:13px;color:#64748B;">Si tienes alguna duda sobre tu compra, puedes responder directamente a este correo.</p>
    </div>
    <div style="text-align:center;font-size:11px;color:#94A3B8;padding:16px;border-top:1px solid #F1F5F9;">
      VEZZI · Sistema de Punto de Venta
    </div>
  </div>
</body>
</html>`;
}

@Injectable()
export class FacturaEmailService {
  private readonly logger = new Logger(FacturaEmailService.name);
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  async enviarFactura(venta: Venta, pdfBuffer: Buffer): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      this.logger.warn('EMAIL_USER/EMAIL_APP_PASSWORD no configurados; no se envió la factura por correo.');
      return;
    }

    const destinatario = venta.cliente?.email;
    if (!destinatario) {
      this.logger.warn(`Venta ${venta.numero_venta}: el cliente no tiene email registrado, no se envía factura.`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"VEZZI" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: `Tu factura ${venta.numero_venta} - VEZZI`,
        html: construirCuerpoCorreo(venta),
        attachments: [
          {
            filename: `factura-${venta.numero_venta}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(`Factura ${venta.numero_venta} enviada por correo a ${destinatario}`);
    } catch (error) {
      this.logger.error(`Error enviando factura ${venta.numero_venta} por correo: ${(error as Error).message}`);
    }
  }
}
