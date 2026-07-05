import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getResumen(): Observable<any> {
    return forkJoin({
      ventasHoy: this.http.get<{ total: number }>(`${this.apiUrl}/venta/ventas-hoy`).pipe(map(r => r.total)),
      totalClientes: this.http.get<any>(`${this.apiUrl}/cliente?limit=1`).pipe(map(r => r.meta.total)),
      stockCritico: this.http.get<{ total: number }>(`${this.apiUrl}/producto/stock-critico`).pipe(map(r => r.total)),
      ingresosMes: this.http.get<{ total: number }>(`${this.apiUrl}/venta/ingresos-mes`).pipe(map(r => r.total)),
      ultimasVentas: this.http.get<any[]>(`${this.apiUrl}/venta/ultimas-ventas`),
    });
  }
}