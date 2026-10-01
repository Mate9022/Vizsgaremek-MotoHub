import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LaborItem } from '../models/labor-item';

@Injectable({
    providedIn: 'root'
})
export class LaborItemService {

    private apiUrl = 'http://localhost:3000/api/labor-items';

    constructor(private http: HttpClient) {
    }

    getAllLaborItems() {
        return this.http.get<LaborItem[]>(
            this.apiUrl
        );
    }

    getLaborItemsByWorkOrder(workOrderId: number) {
        return this.http.get<LaborItem[]>(
            `${this.apiUrl}/work-order/${workOrderId}`
        );
    }

    getLaborItemById(id: number) {
        return this.http.get<LaborItem>(
            `${this.apiUrl}/${id}`
        );
    }

    createLaborItem(
        workOrderId: number,
        description: string,
        hours: number,
        hourlyRate: number
    ) {
        return this.http.post<LaborItem>(
            this.apiUrl,
            {
                workOrderId,
                description,
                hours,
                hourlyRate
            }
        );
    }

    updateLaborItem(
        id: number,
        workOrderId: number,
        description: string,
        hours: number,
        hourlyRate: number
    ) {
        return this.http.put<LaborItem>(
            `${this.apiUrl}/${id}`,
            {
                workOrderId,
                description,
                hours,
                hourlyRate
            }
        );
    }

    deleteLaborItem(id: number) {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}