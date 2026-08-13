import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { VentasService } from '../../services/ventas';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {
  ventas: any[] = [];
  termino: string = '';

  constructor(
    private VentasService: VentasService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarVentas(); }


  cargarVentas() {
    this.VentasService.findAll(this.termino).subscribe(res => {
      let data = res.data || [];
      if (this.filtroEstado) {
        data = data.filter((v: any) => v.estado === this.filtroEstado);
      }
      this.ventas = data;
      this.cdr.detectChanges();
    });
  }

  buscar() { this.cargarVentas(); }


  filtroEstado: string = '';

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.cargarVentas();
  }

  mostrarDetalle: boolean = false;
  detalleVenta: any = null;

  verDetalle(venta: any) {
    this.VentasService.findOne(venta.id).subscribe({
      next: res => {
        this.detalleVenta = res;
        this.mostrarDetalle = true;
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err); alert('Error al cargar detalle de venta'); },
    });
  }
  cerrarDetalle() {
    this.mostrarDetalle = false;
    this.detalleVenta = null;
    this.cdr.detectChanges();
  }

  descargandoFactura: boolean = false;

  descargarFactura(venta: any) {
    this.descargandoFactura = true;
    this.VentasService.descargarFactura(venta.id).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${venta.numero_venta}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.descargandoFactura = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error al descargar la factura');
        this.descargandoFactura = false;
        this.cdr.detectChanges();
      },
    });
  }

  exportandoExcel: boolean = false;

  exportarExcel() {
    this.exportandoExcel = true;
    this.VentasService.exportarExcel(this.filtroEstado, this.termino).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-ventas-${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.exportandoExcel = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error al exportar a Excel');
        this.exportandoExcel = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelandoVenta: boolean = false;

  cancelarVenta(venta: any) {
    const motivo = prompt('Motivo de la cancelación/devolución:');
    if (motivo === null) return;
    if (!confirm(`¿Cancelar la venta ${venta.numero_venta}? Esto repondrá el stock de los productos.`)) return;

    this.cancelandoVenta = true;
    this.VentasService.cancelarVenta(venta.id, motivo).subscribe({
      next: (ventaActualizada) => {
        this.detalleVenta = ventaActualizada;
        this.cancelandoVenta = false;
        this.cargarVentas();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Error al cancelar la venta');
        this.cancelandoVenta = false;
        this.cdr.detectChanges();
      },
    });
  }

  private escapeHtml(valor: any): string {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  imprimirRecibo(venta: any) {
    const moneda = (valor: any) => Number(valor || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const filas = (venta.detalles_venta || []).map((det: any) => `
      <tr>
        <td>${det.cantidad}x ${this.escapeHtml(det.producto?.nombre)}</td>
        <td class="right">$${moneda(det.subtotal)}</td>
      </tr>
    `).join('');

    const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Recibo ${this.escapeHtml(venta.numero_venta)}</title>
<style>
  @page { size: 58mm auto; margin: 0; }
  body { font-family: 'Courier New', monospace; font-size: 11px; width: 58mm; margin: 0; padding: 6px; color: #000; }
  h1 { font-size: 13px; text-align: center; margin: 0 0 2px; letter-spacing: 1px; }
  .sub { text-align: center; font-size: 10px; margin-bottom: 6px; }
  .linea { border-top: 1px dashed #000; margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 2px 0; vertical-align: top; }
  .right { text-align: right; white-space: nowrap; }
  .total td { font-weight: bold; font-size: 12px; }
  .footer { text-align: center; margin-top: 8px; font-size: 10px; }
</style>
</head>
<body>
  <h1>VEZZI</h1>
  <div class="sub">Tienda Local</div>
  <div class="linea"></div>
  <div>Venta: ${this.escapeHtml(venta.numero_venta)}</div>
  <div>Fecha: ${this.escapeHtml(new Date(venta.fecha_venta).toLocaleString('es-CO'))}</div>
  <div>Cliente: ${this.escapeHtml(venta.cliente?.nombre || 'Consumidor final')}</div>
  <div class="linea"></div>
  <table>${filas}</table>
  <div class="linea"></div>
  <table>
    <tr><td>Impuesto</td><td class="right">$${moneda(venta.impuesto)}</td></tr>
    <tr class="total"><td>TOTAL</td><td class="right">$${moneda(venta.total)}</td></tr>
  </table>
  <div class="footer">¡Gracias por su compra!</div>
</body>
</html>`;

    const ventana = window.open('', '_blank', 'width=320,height=600');
    if (!ventana) {
      alert('Habilita las ventanas emergentes para imprimir el recibo');
      return;
    }
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    ventana.print();
  }

  descargandoNotaCredito: boolean = false;

  descargarNotaCredito(venta: any) {
    this.descargandoNotaCredito = true;
    this.VentasService.descargarNotaCredito(venta.id).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nota-credito-${venta.numero_venta}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.descargandoNotaCredito = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error al descargar la nota de crédito');
        this.descargandoNotaCredito = false;
        this.cdr.detectChanges();
      },
    });
  }
}
