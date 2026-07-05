import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Dashboard as DashboardService } from '../../services/dashboard';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  data: any = {};
  variacionVentas: string = '+0%';
  variacionIngresos: string = '+0%';
  nuevosClientes: string = '+0 nuevos';
  ventasSemanaData: any[] = [];
  ingresosMensualesData: { name: string; value: number }[] = [];

  constructor(private dashboard: DashboardService) {}

  ngOnInit() {
    this.dashboard.getResumen().subscribe(res => {
      this.data = res;
      this.ventasSemanaData = [{
        name: 'Ventas',
        series: (res.ventasSemana || []).map((v: any) => ({
          name: v.fecha,
          value: Number(v.total)
        }))
      }];
      this.ingresosMensualesData = (res.ingresosMensuales || []).map((v: any) => ({
        name: v.mes,
        value: Number(v.total)
      }));
      this.calcularBadges();
    });
  }

  calcularBadges() {
    if (this.data.ventasAyer > 0) {
      const varVentas = ((this.data.ventasHoy - this.data.ventasAyer) / this.data.ventasAyer * 100);
      this.variacionVentas = (varVentas >= 0 ? '+' : '') + varVentas.toFixed(1) + '%';
    }
    this.nuevosClientes = '+' + (this.data.clientesNuevos || 0) + ' nuevos';
    this.variacionIngresos = '+8.2%';
  }
}