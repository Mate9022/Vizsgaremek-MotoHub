import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PartItem } from '../models/part-item';

@Injectable({
    providedIn: 'root'
})
export class PartItemService {

    private apiUrl = 'http://localhost:3000/api/part-items';

    constructor(private http: HttpClient) {
    }

    getAllPartItems() {
        return this.http.get<PartItem[]>(
            this.apiUrl
        );
    }

    getPartItemsByWorkOrder(workOrderId: number) {
        return this.http.get<PartItem[]>(
            `${this.apiUrl}/work-order/${workOrderId}`
        );
    }

    createPartItem(
        workOrderId: number,
        name: string,
        quantity: number,
        unitPrice: number
    ) {
        return this.http.post<PartItem>(
            this.apiUrl,
            {
                workOrderId,
                name,
                quantity,
                unitPrice
            }
        );
    }

    updatePartItem(
        id: number,
        workOrderId: number,
        name: string,
        quantity: number,
        unitPrice: number
    ) {
        return this.http.put<PartItem>(
            `${this.apiUrl}/${id}`,
            {
                workOrderId,
                name,
                quantity,
                unitPrice
            }
        );
    }

    deletePartItem(id: number) {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }

}