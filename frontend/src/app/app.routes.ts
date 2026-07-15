import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./components/layout/layout').then(m => m.Layout),
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
            { path: 'productos', loadComponent: () => import('./pages/productos/productos').then(m => m.Productos) },
            { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes').then(m => m.Clientes ) },
            { path: 'ventas', loadComponent: () => import('./pages/ventas/ventas').then(m => m.Ventas) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
];