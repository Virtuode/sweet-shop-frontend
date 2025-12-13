import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login') // Matches your folder structure
      .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register') // Matches your folder structure
      .then(m => m.Register)
  },
  {
    path: '', 
    redirectTo: 'login', // Default to login if they just type /auth
    pathMatch: 'full'
  }
];