import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RolesService } from '../../services/roles';
import { UsuariosService } from '../../services/usuarios';

const PERMISOS = [
  { id: 'dashboard', nombre: 'Ver dashboard' },
  { id: 'productos', nombre: 'Gestionar productos' },
  { id: 'clientes', nombre: 'Gestionar clientes' },
  { id: 'ventas', nombre: 'Ver ventas' },
  { id: 'nueva_venta', nombre: 'Realizar ventas (POS)' },
  { id: 'categorias', nombre: 'Gestionar categorías' },
  { id: 'usuarios', nombre: 'Gestionar usuarios' },
  { id: 'roles', nombre: 'Gestionar roles' },
];

const PERMISOS_POR_ROL: Record<string, string[]> = {
  Administrador: PERMISOS.map(p => p.id),
  Vendedor: ['dashboard', 'productos', 'clientes', 'ventas', 'nueva_venta'],
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
