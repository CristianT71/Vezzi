import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../services/categorias';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categorias: any[] = [];
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;
  nuevaCategoria: any = { nombre: '', descripcion: '' };
  editarCategoriaData: any = {};

  constructor(
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarCategorias(); }

  cargarCategorias() {
    this.categoriasService.findAll().subscribe(res => {
      this.categorias = res.data || [];
      this.cdr.detectChanges();
    });
  }

  get totalCategorias(): number { return this.categorias.length; }
  get totalActivas(): number { return this.categorias.filter(c => c.activo).length; }
  get totalProductos(): number {
    return this.categorias.reduce((sum, c) => sum + (c.productos?.length || 0), 0);
  }

  contarProductos(categoria: any): number {
    return categoria.productos?.length || 0;
  }

  abrirModal() {
    this.nuevaCategoria = { nombre: '', descripcion: '' };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }
  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  crearCategoria() {
    this.categoriasService.create(this.nuevaCategoria).subscribe({
      next: () => { this.cerrarModal(); this.cargarCategorias(); },
      error: (err) => { console.error(err); alert(err.error?.message || 'Error al crear categoría'); },
    });
  }

  editarCategoria(categoria: any) {
    this.editarCategoriaData = { ...categoria };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }
  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  actualizarCategoria() {
    const body = {
      nombre: this.editarCategoriaData.nombre,
      descripcion: this.editarCategoriaData.descripcion,
    };
    this.categoriasService.update(this.editarCategoriaData.id, body).subscribe({
      next: () => { this.cerrarModalEditar(); this.cargarCategorias(); },
      error: (err) => { console.error(err); alert('Error al actualizar categoría'); },
    });
  }

  eliminarCategoria(categoria: any) {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    this.categoriasService.remove(categoria.id).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => { console.error(err); alert('Error al eliminar categoría'); },
    });
  }
}
