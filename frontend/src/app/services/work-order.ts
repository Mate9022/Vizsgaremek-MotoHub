import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WorkOrder } from '../models/work-order';

@Injectable({
    providedIn: 'root'
})
export class WorkOrderService {

    private apiUrl = 'http://localhost:3000/api/work-orders';

    constructor(private http: HttpClient) {
    }

    getAllWorkOrders() {
        return this.http.get<WorkOrder[]>(this.apiUrl);
    }

    getWorkOrderById(id: number) {
        return this.http.get<WorkOrder>(
            `${this.apiUrl}/${id}`
        );
    }

    createWorkOrder(
        motorcycleId: number,
        description: string,
        status: string
    ) {
        return this.http.post<WorkOrder>(
            this.apiUrl,
            {
                motorcycleId,
                description,
                status
            }
        );
    }

    updateWorkOrder(
        id: number,
        motorcycleId: number,
        description: string,
        status: string
    ) {
        return this.http.put<WorkOrder>(
            `${this.apiUrl}/${id}`,
            {
                motorcycleId,
                description,
                status
            }
        );
    }

    deleteWorkOrder(id: number) {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }

}