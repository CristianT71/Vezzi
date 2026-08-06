import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private apiUrl = `${environment.apiUrl}/rol`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=50`);
  }

  create(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: string, data: any): Observable<any> { return this.http.patch(`${this.apiUrl}/${id}`, data); }
  remove(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
