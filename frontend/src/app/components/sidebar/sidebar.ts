import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Package, Users, ShoppingCart, DollarSign, Tag, UserCheck, Shield, LogOut } from 'lucide-angular';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {}
