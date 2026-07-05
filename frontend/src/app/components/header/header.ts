import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  pageTitle: string = 'Dashboard';
  headerInfo: string = '';

  private apiUrl = 'http://localhost:3000/api';

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe(() => {
      this.actualizarHeader();
    });
  }

  actualizarHeader() {
    const ruta = this.router.url.split('?')[0];

    const map: Record<string, { titulo: string; info: string; endpoint?: string }> = {
      '/dashboard': { titulo: 'Dashboard', info: this.fechaActual() },
      '/productos': { titulo: 'Productos', info: 'Cargando...', endpoint: 'producto' },
      '/clientes': { titulo: 'Clientes', info: 'Cargando...', endpoint: 'cliente' },
      '/ventas': { titulo: 'Ventas', info: 'Cargando...', endpoint: 'venta' },
      '/categorias': { titulo: 'Categorías', info: 'Cargando...', endpoint: 'categoria' },
      '/usuarios': { titulo: 'Usuarios', info: 'Cargando...', endpoint: 'usuario' },
      '/roles': { titulo: 'Roles', info: 'Define qué puede hacer cada tipo de usuario' },
    };

    const config = map[ruta];

    if (config) {
      this.pageTitle = config.titulo;
      this.headerInfo = config.info;

      if (config.endpoint) {
        this.http.get<any>(`${this.apiUrl}/${config.endpoint}?limit=1`).subscribe({
          next: res => {
            const total = res.meta?.total || 0;
            this.headerInfo = `${total} ${config.titulo.toLowerCase()} registrados`;
          },
          error: () => {
            this.headerInfo = 'Error al cargar';
          }
        });
      }
    }
  }

  fechaActual(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const ahora = new Date();
    return `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]} de ${ahora.getFullYear()}`;
  }
}