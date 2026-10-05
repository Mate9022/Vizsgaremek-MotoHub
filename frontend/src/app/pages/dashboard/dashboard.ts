import {
    Component,
    OnInit,
    signal
} from '@angular/core';

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


    constructor(
        private dashboardService: DashboardService
    ) {
    }


    ngOnInit() {

        this.loadDashboardData();

    }


    loadDashboardData() {

        this.dashboardService
            .getCustomerCount()
            .subscribe(customers => {

                this.customerCount.set(
                    customers.length
                );

            });


        this.dashboardService
            .getMotorcycleCount()
            .subscribe(motorcycles => {

                this.motorcycleCount.set(
                    motorcycles.length
                );

            });


        this.dashboardService
            .getWorkOrderCount()
            .subscribe(workOrders => {

                this.workOrderCount.set(
                    workOrders.length
                );


                this.openWorkOrderCount.set(
                    workOrders.filter(
                        workOrder =>
                            workOrder.status === 'OPEN'
                    ).length
                );


                this.inProgressWorkOrderCount.set(
                    workOrders.filter(
                        workOrder =>
                            workOrder.status === 'IN_PROGRESS'
                    ).length
                );


                this.waitingPartsWorkOrderCount.set(
                    workOrders.filter(
                        workOrder =>
                            workOrder.status === 'WAITING_PARTS'
                    ).length
                );


                this.readyForPickupWorkOrderCount.set(
                    workOrders.filter(
                        workOrder =>
                            workOrder.status === 'READY_FOR_PICKUP'
                    ).length
                );


                this.completedWorkOrderCount.set(
                    workOrders.filter(
                        workOrder =>
                            workOrder.status === 'COMPLETED'
                    ).length
                );

            });

    }

}