import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/cliente`;
  constructor(private http: HttpClient) {}

  findAll(search: string = ''): Observable<any> {
    let url = `${this.apiUrl}?limit=50`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get(url);
  }

  create(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any): Observable<any> { return this.http.patch(`${this.apiUrl}/${id}`, data); }
  remove(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
  enviarRecordatorios(): Observable<any> { return this.http.post(`${this.apiUrl}/enviar-recordatorios`, {}); }
}