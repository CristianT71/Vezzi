import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categoria`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=50`);
  }

  create(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any): Observable<any> { return this.http.patch(`${this.apiUrl}/${id}`, data); }
  remove(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
