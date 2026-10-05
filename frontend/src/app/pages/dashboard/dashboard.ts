import {
    Component,
    OnInit,
    signal
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import {
    RouterLink
} from '@angular/router';

import {
    DashboardService
} from '../../services/dashboard';

@Component({
    imports: [
        RouterLink
    ],

    selector: 'app-dashboard',

    styleUrl: './dashboard.css',

    templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

    customerCount = signal(0);

    motorcycleCount = signal(0);

    workOrderCount = signal(0);

    openWorkOrderCount = signal(0);

    inProgressWorkOrderCount = signal(0);

    waitingPartsWorkOrderCount = signal(0);

    readyForPickupWorkOrderCount = signal(0);

    completedWorkOrderCount = signal(0);

    isLoading = signal(true);

    loadError = signal<string | null>(null);


    constructor(
        private dashboardService: DashboardService
    ) {
    }


    ngOnInit() {

        this.loadDashboardData();

    }


    loadDashboardData() {
        this.isLoading.set(true);
        this.loadError.set(null);

        forkJoin({
            customers: this.dashboardService.getCustomerCount(),
            motorcycles: this.dashboardService.getMotorcycleCount(),
            workOrders: this.dashboardService.getWorkOrderCount()
        }).subscribe({
            next: ({ customers, motorcycles, workOrders }) => {
                this.customerCount.set(customers.length);
                this.motorcycleCount.set(motorcycles.length);
                this.workOrderCount.set(workOrders.length);
                this.openWorkOrderCount.set(workOrders.filter(item => item.status === 'OPEN').length);
                this.inProgressWorkOrderCount.set(workOrders.filter(item => item.status === 'IN_PROGRESS').length);
                this.waitingPartsWorkOrderCount.set(workOrders.filter(item => item.status === 'WAITING_PARTS').length);
                this.readyForPickupWorkOrderCount.set(workOrders.filter(item => item.status === 'READY_FOR_PICKUP').length);
                this.completedWorkOrderCount.set(workOrders.filter(item => item.status === 'COMPLETED').length);
                this.isLoading.set(false);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Hiba a Dashboard adatainak betöltésekor:', error);
                this.loadError.set('A Dashboard adatai nem tölthetők be. Ellenőrizd a kapcsolatot, majd próbáld újra.');
                this.isLoading.set(false);
            }
        });
    }

}
