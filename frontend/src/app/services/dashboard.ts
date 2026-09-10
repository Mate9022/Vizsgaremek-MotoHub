import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private customersUrl = 'http://localhost:3000/api/customers';
    private motorcyclesUrl = 'http://localhost:3000/api/motorcycles';
    private workOrdersUrl = 'http://localhost:3000/api/work-orders';

    constructor(private http: HttpClient) {
    }

    getCustomerCount() {
        return this.http.get<any[]>(this.customersUrl);
    }

    getMotorcycleCount() {
        return this.http.get<any[]>(this.motorcyclesUrl);
    }

    getWorkOrderCount() {
        return this.http.get<any[]>(this.workOrdersUrl);
    }

}