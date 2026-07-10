import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';
  mostrarPassword: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  cargando: boolean = false;

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Usuario o contraseña incorrectos'
      },
    });
  }
}