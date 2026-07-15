import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { VentasService } from '../../services/ventas';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {
  ventas: any[] = [];
  termino: string = '';

  constructor(
    private VentasService: VentasService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarVentas(); }


  cargarVentas() {
    this.VentasService.findAll(this.termino).subscribe(res => {
      let data = res.data || [];
      if (this.filtroEstado) {
        data = data.filter((v: any) => v.estado === this.filtroEstado);
      }
      this.ventas = data;
      this.cdr.detectChanges();
    });
  }

  buscar() { this.cargarVentas(); }


  filtroEstado: string = '';

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.cargarVentas();
  }
}
