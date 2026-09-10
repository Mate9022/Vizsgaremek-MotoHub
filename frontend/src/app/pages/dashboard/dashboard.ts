import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardService } from '../../services/dashboard';

@Component({
    imports: [RouterLink],
    selector: 'app-dashboard',
    styleUrl: './dashboard.css',
    templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

    customerCount = signal(0);
    motorcycleCount = signal(0);
    workOrderCount = signal(0);

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {

        this.dashboardService.getCustomerCount().subscribe(customers => {
            this.customerCount.set(customers.length);
        });

        this.dashboardService.getMotorcycleCount().subscribe(motorcycles => {
            this.motorcycleCount.set(motorcycles.length);
        });

        this.dashboardService.getWorkOrderCount().subscribe(workOrders => {
            this.workOrderCount.set(workOrders.length);
        });

    }

}