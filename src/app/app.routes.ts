import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';   // Ensure file name matches exactly (auth.guard.ts)
import { adminGuard } from './core/guards/admin-guard'; // Ensure file name matches exactly (admin.guard.ts)

export const routes: Routes = [
  // 1. Home / Shop Dashboard
  {
    path: '',
    loadComponent: () => import('./features/shop/dashboard/dashboard')
      .then(m => m.Dashboard)
  },

  // 2. Authentication (Lazy Loaded)
  // This now points to the file you just created in Step 1
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },

  // 3. Admin Panel (Protected)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], 
    // Fix: Cleaned up the path based on standard structure
    loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard/admin-dashboard')
      .then(m => m.AdminDashboard)
  },

  // 4. Wildcard Redirect
  {
    path: '**',
    redirectTo: ''
  }
];