import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Customer } from '../models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private apiUrl = 'http://localhost:3000/api/customers';

    constructor(private http: HttpClient) {
    }

    getAllCustomers() {
        return this.http.get<Customer[]>(this.apiUrl);
    }

    createCustomer(name: string, phone: string, email: string) {
        return this.http.post<Customer>(this.apiUrl, {
            name,
            phone,
            email
        });
    }

    deleteCustomer(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}