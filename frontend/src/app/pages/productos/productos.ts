import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Productos as ProductosService } from '../../services/productos';

@Component({
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: any[] = [];

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productosService.findAll().subscribe({
      next: res => {
        this.productos = res.data || [];
        this.cdr.detectChanges();
      },
    });
  }
}