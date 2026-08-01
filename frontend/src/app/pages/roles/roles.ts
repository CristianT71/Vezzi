import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../services/roles';
import { UsuariosService } from '../../services/usuarios';

const PERMISOS = [
  { id: 'dashboard', nombre: 'Ver Dashboard', desc: 'Estadísticas y gráficos generales' },
  { id: 'productos', nombre: 'Gestionar Productos', desc: 'Crear, editar y ver productos' },
  { id: 'clientes', nombre: 'Gestionar Clientes', desc: 'Crear, editar y ver clientes' },
  { id: 'ventas', nombre: 'Ver Ventas', desc: 'Consultar historial de ventas' },
  { id: 'nueva_venta', nombre: 'Realizar Ventas (POS)', desc: 'Operar el punto de venta' },
  { id: 'categorias', nombre: 'Gestionar Categorías', desc: 'Crear y editar categorías' },
  { id: 'usuarios', nombre: 'Gestionar Usuarios', desc: 'Crear y editar usuarios del sistema' },
  { id: 'roles', nombre: 'Gestionar Roles', desc: 'Ver y modificar permisos de roles' },
];

const PERMISOS_POR_ROL: Record<string, string[]> = {
  Administrador: PERMISOS.map(p => p.id),
  Vendedor: ['dashboard', 'productos', 'clientes', 'ventas', 'nueva_venta'],
};

const DESCRIPCIONES: Record<string, string> = {
  Administrador: 'Acceso completo al sistema. Gestiona usuarios, roles y configuraciones.',
  Vendedor: 'Acceso operativo. Realiza ventas y consulta productos y clientes.',
};

@Component({
  selector: 'app-roles',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  roles: any[] = [];
  termino: string = '';
  rolSeleccionado: any = null;

  constructor(
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.rolesService.findAll().subscribe(res => {
      const rolesBase = res.data || [];
      this.usuariosService.findAll().subscribe(resUsuarios => {
        const usuarios = resUsuarios.data || [];
        this.roles = rolesBase.map((rol: any) => ({
          ...rol,
          id_permisos: PERMISOS_POR_ROL[rol.nombre] || [],
          totalUsuarios: usuarios.filter((u: any) => u.rol?.nombre === rol.nombre).length,
          descripcion: DESCRIPCIONES[rol.nombre] || rol.descripcion || '',
        }));
        this.cdr.detectChanges();
      });
    });
  }

  get permisos() { return PERMISOS; }

  buscar() {
    this.cdr.detectChanges();
  }

  get filtrados(): any[] {
    if (!this.termino) return this.roles;
    const t = this.termino.toLowerCase();
    return this.roles.filter(r =>
      r.nombre?.toLowerCase().includes(t) ||
      r.descripcion?.toLowerCase().includes(t)
    );
  }

  tienePermiso(rol: any, idPermiso: string): boolean {
    return (rol.id_permisos || []).includes(idPermiso);
  }

  totalPermisos(rol: any): number {
    return (rol.id_permisos || []).length;
  }

  verPermisos(rol: any) {
    this.rolSeleccionado = rol;
    this.cdr.detectChanges();
  }

  cerrarPermisos() {
    this.rolSeleccionado = null;
    this.cdr.detectChanges();
  }
}
