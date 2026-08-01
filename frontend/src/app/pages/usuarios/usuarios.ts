import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios';
import { RolesService } from '../../services/roles';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  termino: string = '';
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;
  nuevoUsuario: any = { nombre_usuario: '', password: '', nombre_completo: '', id_rol: '' };
  editarUsuarioData: any = {};

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles() {
    this.rolesService.findAll().subscribe(res => {
      this.roles = res.data || [];
      this.cdr.detectChanges();
    });
  }

  cargarUsuarios() {
    this.usuariosService.findAll().subscribe(res => {
      this.usuarios = res.data || [];
      this.cdr.detectChanges();
    });
  }

  buscar() {
    this.cdr.detectChanges();
  }

  get filtrados(): any[] {
    if (!this.termino) return this.usuarios;
    const t = this.termino.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre_usuario?.toLowerCase().includes(t) ||
      u.nombre_completo?.toLowerCase().includes(t) ||
      u.rol?.nombre?.toLowerCase().includes(t)
    );
  }

  abrirModal() {
    this.nuevoUsuario = { nombre_usuario: '', password: '', nombre_completo: '', id_rol: '' };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }
  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  crearUsuario() {
    this.usuariosService.create(this.nuevoUsuario).subscribe({
      next: () => { this.cerrarModal(); this.cargarUsuarios(); },
      error: (err) => { console.error(err); alert(err.error?.message || 'Error al crear usuario'); },
    });
  }

  editarUsuario(usuario: any) {
    this.editarUsuarioData = {
      ...usuario,
      id_rol: usuario.rol?.id,
      password: '',
    };
    this.mostrarModalEditar = true;
    this.cdr.detectChanges();
  }
  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.cdr.detectChanges();
  }

  actualizarUsuario() {
    const body: any = {
      nombre_usuario: this.editarUsuarioData.nombre_usuario,
      nombre_completo: this.editarUsuarioData.nombre_completo,
      id_rol: this.editarUsuarioData.id_rol,
      activo: this.editarUsuarioData.activo,
    };
    if (this.editarUsuarioData.password) body.password = this.editarUsuarioData.password;
    this.usuariosService.update(this.editarUsuarioData.id, body).subscribe({
      next: () => { this.cerrarModalEditar(); this.cargarUsuarios(); },
      error: (err) => { console.error(err); alert('Error al actualizar usuario'); },
    });
  }

  eliminarUsuario(usuario: any) {
    if (!confirm(`¿Eliminar el usuario "${usuario.nombre_usuario}"?`)) return;
    this.usuariosService.remove(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => { console.error(err); alert('Error al eliminar usuario'); },
    });
  }
}
