import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private apiUrl = 'http://localhost:3000/api/cliente';
  constructor(private http: HttpClient) {}

  findAll(search: string = ''): Observable<any> {
    let url = `${this.apiUrl}?limit=50`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get(url);
  }

  create(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any): Observable<any> { return this.http.patch(`${this.apiUrl}/${id}`, data); }
}