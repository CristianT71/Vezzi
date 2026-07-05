import { Component } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, Package, Users, ShoppingCart, DollarSign, Tag, UserCheck, Shield, LogOut } from 'lucide-angular';


@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
