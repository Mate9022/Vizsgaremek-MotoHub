import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Motorcycles } from './pages/motorcycles/motorcycles';

export const routes: Routes = [

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
    }

];