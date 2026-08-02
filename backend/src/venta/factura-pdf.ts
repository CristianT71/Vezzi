import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import * as path from 'path';
import { Venta } from './entities/venta.entity';

const LOGO_PATH = path.join(process.cwd(), 'src', 'assets', 'logo.png');

const COLORS = {
  primaryDark: '#0F172A',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  bg: '#F8FAFC',
  white: '#FFFFFF',
};

const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  PAGADA: { bg: '#ECFDF5', color: '#059669' },
  PENDIENTE: { bg: '#FFFBEB', color: '#D97706' },
  CANCELADA: { bg: '#FEF2F2', color: '#DC2626' },
};

function estadoColor(estado: string) {
  return ESTADO_COLORS[estado] ?? { bg: '#EFF6FF', color: '#2563EB' };
}

function money(value: string | number): string {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fechaCorta(fecha: Date | string): string {
  return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function generarFacturaPdf(venta: Venta, baseUrl: string): Promise<Buffer> {
  const qrUrl = `${baseUrl}/api/venta/${venta.id}/verificar`;
  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    type: 'png',
    width: 320,
    margin: 1,
    color: { dark: '#0F172A', light: '#FFFFFF' },
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 20, left: 40, right: 40 },
      bufferPages: true,
    });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const margin = 40;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const contentWidth = pageWidth - margin * 2;
    const footerLimit = pageHeight - 70;

    // ---------- Título con barras ----------
    let y = margin;
    doc.font('Helvetica-Bold').fontSize(22).fillColor(COLORS.primaryDark);
    const title = 'FACTURA';
    const titleWidth = doc.widthOfString(title);
    const barGap = 18;
    const barsWidth = (contentWidth - titleWidth - barGap * 2) / 2;
    const barY = y + 9;
    doc.rect(margin, barY, barsWidth, 5).fill(COLORS.primaryDark);
    doc.rect(margin + barsWidth + barGap + titleWidth + barGap, barY, barsWidth, 5).fill(COLORS.primaryDark);
    doc.fillColor(COLORS.primaryDark).text(title, margin + barsWidth + barGap, y, { width: titleWidth, align: 'center' });

    y += 34;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.textSecondary)
      .text(`FECHA:  ${fechaCorta(venta.fecha_venta)}      •      NÚMERO:  ${venta.numero_venta}`, margin, y, {
        width: contentWidth,
        align: 'center',
      });

    y += 22;
    doc.moveTo(margin, y).lineTo(margin + contentWidth, y).strokeColor(COLORS.border).lineWidth(1).stroke();
    y += 26;

    // ---------- Emisor (logo) / Cliente ----------
    const gap = 24;
    const leftWidth = contentWidth * 0.45;
    const rightX = margin + leftWidth + gap;
    const rightWidth = contentWidth - leftWidth - gap;
    const blockTop = y;

    let leftY = blockTop;
    try {
      doc.image(LOGO_PATH, margin, leftY, { height: 42 });
    } catch {
      // si el logo no está disponible, se omite sin romper la generación
    }
    doc.font('Helvetica-Bold').fontSize(15).fillColor(COLORS.textPrimary)
      .text('VEZZI', margin + 52, leftY + 4);
    doc.font('Helvetica').fontSize(9).fillColor(COLORS.textSecondary)
      .text('Tienda Local · Sistema de Punto de Venta', margin + 52, leftY + 22);
    leftY += 52;

    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.textSecondary)
      .text(`Atendido por: ${venta.usuario?.nombre_completo ?? '-'}`, margin, leftY);
    leftY += 16;

    const estado = estadoColor(venta.estado);
    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.textSecondary).text('Estado:', margin, leftY + 2);
    const badgeText = venta.estado;
    const badgeWidth = doc.font('Helvetica-Bold').fontSize(9).widthOfString(badgeText) + 16;
    doc.roundedRect(margin + 48, leftY - 2, badgeWidth, 16, 8).fill(estado.bg);
    doc.fillColor(estado.color).font('Helvetica-Bold').fontSize(9)
      .text(badgeText, margin + 48, leftY + 2, { width: badgeWidth, align: 'center' });
    leftY += 20;

    const qrSize = 80;
    const qrGap = 14;
    const clienteTextWidth = rightWidth - qrSize - qrGap;

    let rightY = blockTop;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.textSecondary)
      .text('CLIENTE', rightX, rightY, { characterSpacing: 0.5 });
    rightY += 16;

    const cliente = venta.cliente;
    doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.textPrimary)
      .text(cliente?.nombre ?? 'Sin cliente', rightX, rightY, { width: clienteTextWidth });
    rightY += 17;

    const clienteLineas = [
      cliente?.nit ? `NIT/RUC: ${cliente.nit}` : null,
      cliente?.direccion ? cliente.direccion : null,
      cliente?.telefono ? `Tel: ${cliente.telefono}` : null,
      cliente?.email ? cliente.email : null,
    ].filter(Boolean) as string[];

    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.textSecondary);
    clienteLineas.forEach((linea) => {
      doc.text(linea, rightX, rightY, { width: clienteTextWidth });
      rightY += 14;
    });

    doc.image(qrBuffer, rightX + rightWidth - qrSize, blockTop, { width: qrSize, height: qrSize });

    y = Math.max(leftY, rightY) + 20;
    doc.moveTo(margin, y).lineTo(margin + contentWidth, y).strokeColor(COLORS.border).lineWidth(1).stroke();
    y += 20;

    // ---------- Tabla de productos ----------
    const colX = {
      producto: margin,
      cantidad: margin + contentWidth - 260,
      precio: margin + contentWidth - 190,
      subtotal: margin + contentWidth - 90,
    };
    const rowHeight = 24;

    const drawTableHeader = (headerY: number) => {
      doc.rect(margin, headerY, contentWidth, rowHeight).fill(COLORS.primaryDark);
      doc.fillColor(COLORS.white).font('Helvetica-Bold').fontSize(9.5);
      doc.text('PRODUCTO', colX.producto + 12, headerY + 7);
      doc.text('CANT.', colX.cantidad, headerY + 7, { width: 60, align: 'right' });
      doc.text('PRECIO UNIT.', colX.precio, headerY + 7, { width: 80, align: 'right' });
      doc.text('SUBTOTAL', colX.subtotal, headerY + 7, { width: 90 - 12, align: 'right' });
      return headerY + rowHeight;
    };

    y = drawTableHeader(y);

    const detalles = venta.detalles_venta ?? [];
    let subtotalGeneral = 0;

    detalles.forEach((det, i) => {
      if (y + rowHeight > footerLimit) {
        doc.addPage();
        y = margin;
        y = drawTableHeader(y);
      }

      if (i % 2 === 1) {
        doc.rect(margin, y, contentWidth, rowHeight).fill(COLORS.bg);
      }

      subtotalGeneral += Number(det.subtotal) || 0;

      doc.fillColor(COLORS.textPrimary).font('Helvetica').fontSize(9.5);
      doc.text(det.producto?.nombre ?? '-', colX.producto + 12, y + 7, { width: colX.cantidad - colX.producto - 20 });
      doc.text(String(det.cantidad), colX.cantidad, y + 7, { width: 60, align: 'right' });
      doc.text(money(det.precio_unitario), colX.precio, y + 7, { width: 80, align: 'right' });
      doc.font('Helvetica-Bold').text(money(det.subtotal), colX.subtotal, y + 7, { width: 90 - 12, align: 'right' });

      doc.moveTo(margin, y + rowHeight).lineTo(margin + contentWidth, y + rowHeight)
        .strokeColor(COLORS.border).lineWidth(0.5).stroke();

      y += rowHeight;
    });

    // ---------- Totales ----------
    if (y + 110 > footerLimit) {
      doc.addPage();
      y = margin;
    }
    y += 18;

    const totalsWidth = 220;
    const totalsLabelX = margin + contentWidth - totalsWidth;
    const totalsValueX = totalsLabelX + totalsWidth - 100;
    const impuesto = Number(venta.impuesto) || 0;
    const total = Number(venta.total) || 0;

    doc.font('Helvetica').fontSize(10).fillColor(COLORS.textSecondary);
    doc.text('Subtotal', totalsLabelX, y, { width: totalsWidth - 100 });
    doc.text(money(subtotalGeneral), totalsValueX, y, { width: 100, align: 'right' });
    y += 18;
    doc.text('Impuesto', totalsLabelX, y, { width: totalsWidth - 100 });
    doc.text(money(impuesto), totalsValueX, y, { width: 100, align: 'right' });
    y += 16;

    doc.moveTo(totalsLabelX, y).lineTo(margin + contentWidth, y).strokeColor(COLORS.textPrimary).lineWidth(1).stroke();
    y += 10;

    doc.font('Helvetica-Bold').fontSize(13).fillColor(COLORS.textPrimary);
    doc.text('TOTAL FACTURA', totalsLabelX, y, { width: totalsWidth - 100 });
    doc.text(money(total), totalsValueX, y, { width: 100, align: 'right' });

    // ---------- Pie de página (todas las páginas) ----------
    const range = doc.bufferedPageRange();
    const totalPages = range.count;
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      const bottomY = pageHeight - 55;
      doc.moveTo(margin, bottomY).lineTo(pageWidth - margin, bottomY)
        .strokeColor(COLORS.border).lineWidth(0.5).stroke();
      doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.textSecondary)
        .text('Gracias por su compra en VEZZI', margin, bottomY + 8, { width: contentWidth, align: 'center', lineBreak: false });
      doc.fontSize(7.5).fillColor('#94A3B8')
        .text(
          `Generado el ${new Date().toLocaleString('es-CO')}  ·  Página ${i - range.start + 1} de ${totalPages}`,
          margin,
          bottomY + 21,
          { width: contentWidth, align: 'center', lineBreak: false },
        );
    }

    doc.end();
  });
}
