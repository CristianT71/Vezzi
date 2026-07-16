import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-venta',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './nueva-venta.html',
  styleUrl: './nueva-venta.css',
})
export class NuevaVenta implements OnInit {
  productos: any[] = [];
  clientes: any[] = [];
  carrito: any[] = [];
  termino: string = '';
  clienteSeleccionado: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/producto?limit=100').subscribe(res => {
      this.productos = res.data || [];
      this.cdr.detectChanges();
    });

    this.http.get<any>('http://localhost:3000/api/cliente?limit=100').subscribe(res => { 
      this.clientes = res.data || [];
      this.cdr.detectChanges();
    });
    
  }

  buscarProductos() {
    this.http.get<any>(`http://localhost:3000/api/producto?limit=100&search=${this.termino}`)
      .subscribe(res => this.productos = res.data || []);
  }

  agregarAlCarrito(prod: any) {
    const existente = this.carrito.find(item => item.id === prod.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({ ...prod, cantidad: 1 });
    }
  }

  aumentarCantidad(item: any) { item.cantidad++; }
  disminuirCantidad(item: any) {
    if (item.cantidad > 1) item.cantidad--;
    else this.eliminarDelCarrito(item);
  }
  eliminarDelCarrito(item: any) {
    this.carrito = this.carrito.filter(i => i.id !== item.id);
  }

  get subtotal(): number {
    return this.carrito.reduce((sum, item) => sum + item.cantidad * Number(item.precio_venta), 0);
  }
  get iva(): number { return this.subtotal * 0.19; }
  get total(): number { return this.subtotal + this.iva; }

  cobrar() {
    const id_usuario = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    this.http.post<any>('http://localhost:3000/api/venta', {
      id_cliente: Number(this.clienteSeleccionado),
      id_usuario,
      impuesto: Number(this.iva.toFixed(2)),
      total: 0,
    }).subscribe({
      next: (venta) => {
        let pendientes = this.carrito.length;
        for (const item of this.carrito) {
          this.http.post('http://localhost:3000/api/detalle-venta', {
            id_venta: venta.id,
            id_producto: item.id,
            cantidad: item.cantidad,
            precio_unitario: Number(item.precio_venta),
          }).subscribe({
            error: (err) => {
              const msg = err.error?.message || 'Error al agregar producto';
              alert(msg);
            },
            next: () => {
              pendientes--;
              if (pendientes === 0) {
                this.http.post(`http://localhost:3000/api/venta/${venta.id}/calcular-total`, {}).subscribe(() => {
                  alert(`Venta ${venta.numero_venta} creada exitosamente`);
                  this.router.navigate(['/ventas']);
                });
              }
            },
          });
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al crear venta';
        alert(msg);
      },
    });
  }
}