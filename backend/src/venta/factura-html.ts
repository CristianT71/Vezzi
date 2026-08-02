import { Venta } from './entities/venta.entity';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

export function generarFacturaHtml(venta: Venta): string {
  const estado = estadoColor(venta.estado);
  const detalles = venta.detalles_venta ?? [];
  const subtotal = detalles.reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);

  const itemsRows = detalles
    .map(
      (d) => `
        <tr>
          <td>${escapeHtml(d.producto?.nombre ?? '-')}</td>
          <td style="text-align:right">${d.cantidad}</td>
          <td style="text-align:right">${money(d.subtotal)}</td>
        </tr>`,
    )
    .join('');

  const fecha = new Date(venta.fecha_venta).toLocaleString('es-CO');
  const clienteNombre = escapeHtml(venta.cliente?.nombre ?? 'Sin cliente');
  const vendedor = escapeHtml(venta.usuario?.nombre_completo ?? '-');
  const numeroVenta = escapeHtml(venta.numero_venta);
  const estadoTexto = escapeHtml(venta.estado);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Factura ${numeroVenta} · VEZZI</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; background:#F8FAFC; margin:0; padding:24px 16px; color:#1E293B; }
  .card { max-width: 480px; margin: 0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.08); }
  .header { background:#0F172A; color:#fff; padding:24px; }
  .header h1 { margin:0; font-size:20px; letter-spacing:1px; }
  .header p { margin:4px 0 0; color:#94A3B8; font-size:12px; }
  .body { padding:20px 24px; }
  .row { display:flex; justify-content:space-between; align-items:center; font-size:13px; padding:8px 0; border-bottom:1px solid #F1F5F9; color:#64748B; }
  .row b { color:#1E293B; }
  .badge { display:inline-block; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:700; }
  table { width:100%; border-collapse:collapse; margin-top:16px; font-size:13px; }
  th { text-align:left; font-size:11px; color:#64748B; padding:6px 0; border-bottom:1px solid #E2E8F0; }
  td { padding:8px 0; border-bottom:1px solid #F1F5F9; }
  .totales { margin-top:14px; }
  .totales .row.total { font-size:16px; font-weight:700; color:#1E293B; border-top:2px solid #E2E8F0; border-bottom:none; padding-top:12px; }
  .footer { text-align:center; font-size:11px; color:#94A3B8; padding:16px; }
  .ok { display:flex; align-items:center; gap:8px; background:#ECFDF5; color:#059669; font-size:12px; font-weight:600; padding:10px 24px; }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>VEZZI</h1>
      <p>Verificación de factura</p>
    </div>
    <div class="ok">✓ Documento verificado en el sistema VEZZI</div>
    <div class="body">
      <div class="row"><span>Número</span><b>${numeroVenta}</b></div>
      <div class="row"><span>Fecha</span><b>${fecha}</b></div>
      <div class="row"><span>Cliente</span><b>${clienteNombre}</b></div>
      <div class="row"><span>Atendido por</span><b>${vendedor}</b></div>
      <div class="row"><span>Estado</span><span class="badge" style="background:${estado.bg};color:${estado.color}">${estadoTexto}</span></div>

      <table>
        <thead><tr><th>Producto</th><th style="text-align:right">Cant.</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <div class="totales">
        <div class="row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="row"><span>Impuesto</span><span>${money(venta.impuesto)}</span></div>
        <div class="row total"><span>TOTAL</span><span>${money(venta.total)}</span></div>
      </div>
    </div>
    <div class="footer">Documento generado por VEZZI · Sistema de Punto de Venta</div>
  </div>
</body>
</html>`;
}
