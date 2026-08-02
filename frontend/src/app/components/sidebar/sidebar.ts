import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  usuario: any = {};
  esAdmin = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.usuario = this.auth.getUsuario() || { nombre_completo: 'Usuario', rol: { nombre: 'rol' } };
    this.esAdmin = (this.usuario?.rol?.nombre || '').trim().toLowerCase() === 'admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}