import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Productos as ProductosService } from '../../services/productos';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: any[] = [];
  mostrarModal: boolean = false;
  categorias: any[] = [];
  termino: string = '';
  mostrarModalEditar: boolean = false;
  editarProductoData: any = {};
  mostrarFiltros: boolean = false;
  categoriaFiltro: string = '';
  nuevoProducto: any = {
    codigo: '', nombre: '', costo: '', precio_venta: '',
    stock: 0, id_categoria: ''
  };



  constructor(
    private productosService: ProductosService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.productosService.findAll().subscribe({
      next: res => {
        this.productos = res.data || [];
        this.cdr.detectChanges();
      },
    });
    this.http.get<any>('http://localhost:3000/api/categoria?limit=50').subscribe(res => {
      this.categorias = res.data || [];
    });
  }

  abrirModal() {
    this.mostrarModal = true;
    this.http.get<any>('http://localhost:3000/api/categoria?limit=50').subscribe(res => {
      this.categorias = res.data || [];
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  crearProducto() {
    const body = {
      ...this.nuevoProducto,
      costo: Number(this.nuevoProducto.costo),
      precio_venta: Number(this.nuevoProducto.precio_venta),
      stock: Number(this.nuevoProducto.stock),
      id_categoria: Number(this.nuevoProducto.id_categoria),
    };
    this.productosService.create(body).subscribe({
      next: () => {
        this.cerrarModal();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        alert('Error al crear producto. Revisa la consola.');
      },
    });
  }

  buscar() {
    this.productosService.findAll(1, 10, this.termino).subscribe ({
      next: res => {
        this.productos = res.data || [];
        this.cdr.detectChanges();
      }
    })
  }


  editarProducto(producto: any) {
    this.editarProductoData = {
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      costo: producto.costo,
      precio_venta: producto.precio_venta,
      stock: producto.stock,
      id_categoria: producto.categoria?.id || '',
    };
    this.mostrarModalEditar = true;
    this.http.get<any>('http://localhost:3000/api/categoria?limit=50').subscribe(res => {
      this.categorias = res.data || [];
    });
  }
    
  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }
  
  actualizarProducto() {
    const body = {
      codigo: this.editarProductoData.codigo,
      nombre: this.editarProductoData.nombre,
      costo: Number(this.editarProductoData.costo),
      precio_venta: Number(this.editarProductoData.precio_venta),
      stock: Number(this.editarProductoData.stock),
      id_categoria: Number(this.editarProductoData.id_categoria),
    };
    this.productosService.update(this.editarProductoData.id, body).subscribe({
      next: () => {
        this.cerrarModalEditar();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al actualizar producto', err);
        alert('Error al actualizar producto');
      },
    });
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  filtrar() {
    this.productosService.findAll(1, 10, this.termino, this.categoriaFiltro).subscribe({
      next: res => {
        this.productos = res.data || [];
        this.cdr.detectChanges();
      },
    });
  }
}