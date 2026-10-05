import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Motorcycles } from './pages/motorcycles/motorcycles';
import { WorkOrders } from './pages/work-orders/work-orders';
import { Settings } from './pages/settings/settings';

import { AdminLayout } from './layouts/admin-layout/admin-layout';

import { Login } from './pages/login/login';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    // Publikus főoldal
    {
        path: '',
        component: Home
    },

    // Admin bejelentkezés
    {
        path: 'login',
        component: Login
    },

    // Védett admin felület
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: Dashboard
            },
            {
                path: 'customers',
                component: Customers
            },
            {
                path: 'motorcycles',
                component: Motorcycles
            },
            {
                path: 'work-orders',
                component: WorkOrders
            },
            {
                path: 'settings',
                component: Settings
            }
        ]
    }

];
