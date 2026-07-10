import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-clientes',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  clientes: any[] = [];
  termino: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/cliente?limit=50').subscribe(res => {
      this.clientes = res.data || [];
    });
  }

  buscar() {
    this.http.get<any>(`http://localhost:3000/api/cliente?search=${this.termino}&limit=50`).subscribe( res => {
      this.clientes = res.data || [];
    });
  }

  abrirModal() {}
}
