import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard], //Protección de rutas
        loadComponent: () =>
            import('./features/dashboard/layout/dashboard-layout.component')
                .then(m => m.DashboardLayoutComponent),
        children: [
            { path: '', redirectTo: 'characters', pathMatch: 'full' },
            {
                path: 'characters',
                loadComponent: () =>
                    import('./features/dashboard/personajes/personajes-lista.component')
                        .then(m => m.PersonajeListaComponent)
            },
            {
                path: 'estadisticas',
                loadComponent: () =>
                    import('./features/dashboard/personaje-estadisticas/personaje-estadisticas.component')
                        .then(m => m.PersonajeEstadisticasComponent)
            }
        ]
    },
    { path: '**', redirectTo: '/login' }
];
