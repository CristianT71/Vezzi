import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from '../../services/clientes';
import { environment } from '../../../environments/environment';

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
  nuevoCliente: any = { nombre: '', telefono: '', nit: '', direccion: '', email: '' };
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
    this.nuevoCliente = { nombre: '', telefono: '', nit: '', direccion: '', email: '' };
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
    const body = {
      nombre: this.editarClienteData.nombre,
      telefono: this.editarClienteData.telefono,
      nit: this.editarClienteData.nit,
      direccion: this.editarClienteData.direccion,
      email: this.editarClienteData.email,
    };
    this.clientesService.update(this.editarClienteData.id, body).subscribe({
      next: () => { this.cerrarModalEditar(); this.cargarClientes(); },
      error: (err) => { console.error(err); alert('Error al actualizar cliente'); },
    });
  }

  tieneDeuda(cliente: any): boolean {
    return Number(cliente.saldo_deuda || 0) > 0;
  }

  eliminarCliente(cliente: any) {
    if (!confirm(`¿Eliminar el cliente "${cliente.nombre}"?`)) return;
    this.clientesService.remove(cliente.id).subscribe({
      next: () => this.cargarClientes(),
      error: (err) => { console.error(err); alert('Error al eliminar cliente'); },
    });
  }

  mostrarModalPago: boolean = false;
  pagoData: any = { monto: '', metodo_pago: 'EFECTIVO', referencia: '' };

  abrirPago(cliente: any) {
    this.pagoData = {
      id_cliente: cliente.id,
      cliente_nombre: cliente.nombre,
      saldo_deuda: cliente.saldo_deuda,
      monto: '',
      metodo_pago: 'EFECTIVO',
      referencia: '',
    };
    this.mostrarModalPago = true;
    this.cdr.detectChanges();
  }
  cerrarModalPago() {
    this.mostrarModalPago = false;
    this.cdr.detectChanges();
  }

  registrarPago() {
    const id_usuario = JSON.parse(localStorage.getItem('usuario') || '{}').id;
    const body = {
      id_cliente: Number(this.pagoData.id_cliente),
      id_usuario,
      monto: Number(this.pagoData.monto),
      metodo_pago: this.pagoData.metodo_pago,
      referencia: this.pagoData.referencia || undefined,
    };
    this.http.post(`${environment.apiUrl}/pago`, body).subscribe({
      next: () => { this.cerrarModalPago(); this.cargarClientes(); alert('Pago registrado'); },
      error: (err) => { console.error(err); alert('Error al registrar pago'); },
    });
  }
}