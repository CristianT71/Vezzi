import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  usuario: any = {};

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.usuario = this.auth.getUsuario() || { nombre_completo: 'Usuario', rol: { nombre: 'rol' } };
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}