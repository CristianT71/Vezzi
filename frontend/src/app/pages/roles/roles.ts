import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
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
  Administrador: 'Acceso completo al sistema. Puede gestionar usuarios, roles, configuraciones y todas las operaciones.',
  Vendedor: 'Acceso operativo. Puede realizar ventas, consultar productos y clientes, pero sin acceso a configuraciones del sistema.',
};

@Component({
  selector: 'app-roles',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  roles: any[] = [];

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

  tienePermiso(rol: any, idPermiso: string): boolean {
    return (rol.id_permisos || []).includes(idPermiso);
  }

  totalPermisos(rol: any): number {
    return (rol.id_permisos || []).length;
  }
}
