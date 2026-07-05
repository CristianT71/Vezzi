import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(nombre_usuario: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nombre_usuario, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario')
  }

  getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

}