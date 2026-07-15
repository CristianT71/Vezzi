import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = 'http://localhost:3000/api/venta';
  constructor(private http: HttpClient) {}

  findAll(search: string = ''): Observable<any> {
    let url = `${this.apiUrl}?limit=50`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get(url);
  }
}