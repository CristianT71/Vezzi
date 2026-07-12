import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from '../../services/clientes';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: any[] = [];
  termino: string = '';
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;
  nuevoCliente: any = { nombre: '', telefono: '' };
  editarClienteData: any = {};

  constructor(
    private clientesService: ClientesService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarClientes(); }

  cargarClientes() {
    this.clientesService.findAll(this.termino).subscribe(res => {
    this.clientes = res.data || [];
    this.cdr.detectChanges();
    });
  }

  buscar() { this.cargarClientes(); }

  abrirModal() {
    this.nuevoCliente = { nombre: '', telefono: '' };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }
  cerrarModal() { 
    this.mostrarModal = false; 
    this.cdr.detectChanges();
  }

  crearCliente() {
    this.clientesService.create(this.nuevoCliente).subscribe({
      next: () => { this.cerrarModal(); this.cargarClientes(); },
      error: (err) => { console.error(err); alert('Error al crear cliente'); },
    });
  }

  editarCliente(cliente: any) {
    this.editarClienteData = { ...cliente };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }
  cerrarModalEditar() { 
    this.mostrarModalEditar = false; 
    this.cdr.detectChanges();
  }

  actualizarCliente() {
    const body = { nombre: this.editarClienteData.nombre, telefono: this.editarClienteData.telefono };
    this.clientesService.update(this.editarClienteData.id, body).subscribe({
      next: () => { this.cerrarModalEditar(); this.cargarClientes(); },
      error: (err) => { console.error(err); alert('Error al actualizar cliente'); },
    });
  }
}