import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = `${environment.apiUrl}/venta`;
  constructor(private http: HttpClient) {}

  findAll(search: string = ''): Observable<any> {
    let url = `${this.apiUrl}?limit=50`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get(url);
  }

  findOne(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  descargarFactura(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/factura`, { responseType: 'blob' });
  }

  exportarExcel(estado: string = '', search: string = ''): Observable<Blob> {
    let url = `${this.apiUrl}/exportar/excel?`;
    const params: string[] = [];
    if (estado) params.push(`estado=${encodeURIComponent(estado)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    url += params.join('&');
    return this.http.get(url, { responseType: 'blob' });
  }

  cancelarVenta(id: number, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancelar`, { motivo });
  }

  descargarNotaCredito(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/nota-credito`, { responseType: 'blob' });
  }
}