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

}