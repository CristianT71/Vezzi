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
