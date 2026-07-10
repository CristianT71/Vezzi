import { Component, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnDestroy {
  pageTitle: string = 'Dashboard';
  headerInfo: string = '';
  private sub?: Subscription;

  private apiUrl = 'http://localhost:3000/api';

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.actualizarHeader();
        }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  actualizarHeader() {
  const ruta = this.router.url.split('?')[0];

  const map: Record<string, { titulo: string; info: string }> = {
    '/dashboard': { titulo: 'Dashboard', info: this.fechaActual() },
    '/productos': { titulo: 'Productos', info: 'Gestión de productos' },
    '/clientes': { titulo: 'Clientes', info: 'Gestión de clientes' },
    '/ventas': { titulo: 'Ventas', info: 'Historial de ventas' },
    '/categorias': { titulo: 'Categorías', info: 'Gestión de categorías' },
    '/usuarios': { titulo: 'Usuarios', info: 'Usuarios del sistema' },
    '/roles': { titulo: 'Roles', info: 'Define qué puede hacer cada tipo de usuario' },
  };

  const config = map[ruta];
  if (config) {
    this.pageTitle = config.titulo;
    this.headerInfo = config.info;
  }
}

  fechaActual(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const ahora = new Date();
    return `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]} de ${ahora.getFullYear()}`;
  }
}