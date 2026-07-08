import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Productos as ProductosService } from '../../services/productos';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: any[] = [];
  mostrarModal: boolean = false;
  categorias: any[] = [];
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
}