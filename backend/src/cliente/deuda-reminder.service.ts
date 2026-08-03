import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { MailerService } from 'src/common/mailer/mailer.service';

function money(value: string | number): string {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function construirCuerpoRecordatorio(cliente: Cliente): string {
  return `<!doctype html>
<html lang="es">
<body style="font-family: Arial, Helvetica, sans-serif; background:#F8FAFC; margin:0; padding:24px 16px;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <div style="background:#0F172A;padding:24px;">
      <h1 style="margin:0;font-size:20px;color:#ffffff;letter-spacing:1px;">VEZZI</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#94A3B8;">Tienda Local</p>
    </div>
    <div style="padding:24px;color:#1E293B;">
      <p style="font-size:14px;">Hola <b>${cliente.nombre}</b>,</p>
      <p style="font-size:14px;">Este es un recordatorio de tu saldo pendiente con nosotros: <b>${money(cliente.saldo_deuda)}</b>.</p>
      <p style="font-size:13px;color:#64748B;">Si ya realizaste el pago, ignora este mensaje. Ante cualquier duda, responde directamente a este correo.</p>
    </div>
    <div style="text-align:center;font-size:11px;color:#94A3B8;padding:16px;border-top:1px solid #F1F5F9;">
      VEZZI · Sistema de Punto de Venta
    </div>
  </div>
</body>
</html>`;
}

@Injectable()
export class DeudaReminderService {
  private readonly logger = new Logger(DeudaReminderService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async enviarRecordatorios(): Promise<{ enviados: number; total: number }> {
    const clientes = await this.clienteRepository.find({
      where: { saldo_deuda: MoreThan('0'), deleteAt: IsNull() },
    });

    let enviados = 0;
    for (const cliente of clientes) {
      if (!cliente.email) {
        this.logger.warn(`Cliente ${cliente.nombre} tiene deuda pero no tiene email registrado, se omite.`);
        continue;
      }
      const ok = await this.mailerService.enviarCorreo({
        to: cliente.email,
        subject: 'Recordatorio de saldo pendiente - VEZZI',
        html: construirCuerpoRecordatorio(cliente),
      });
      if (ok) enviados++;
    }

    this.logger.log(`Recordatorios de deuda: ${enviados} enviados de ${clientes.length} clientes con saldo pendiente.`);
    return { enviados, total: clientes.length };
  }
}
