import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Motorcycle } from '../models/motorcycle';

@Injectable({
    providedIn: 'root'
})
export class MotorcycleService {

    private apiUrl = 'http://localhost:3000/api/motorcycles';

    constructor(private http: HttpClient) {
    }

    getAllMotorcycles() {
        return this.http.get<Motorcycle[]>(this.apiUrl);
    }

    createMotorcycle(
        customerId: number,
        brand: string,
        model: string,
        modelYear: number | null,
        licensePlate: string,
        vin: string
    ) {
        return this.http.post<Motorcycle>(this.apiUrl, {
            customerId,
            brand,
            model,
            modelYear,
            licensePlate,
            vin
        });
    }

    deleteMotorcycle(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

updateMotorcycle(
    id: number,
    customerId: number,
    brand: string,
    model: string,
    modelYear: number | null,
    licensePlate: string,
    vin: string
) {
    return this.http.put<Motorcycle>(
        `${this.apiUrl}/${id}`,
        {
            customerId,
            brand,
            model,
            modelYear,
            licensePlate,
            vin
        }
    );
}

}