import { Component, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';

@Component({
    imports: [],
    selector: 'app-customers',
    styleUrl: './customers.css',
    templateUrl: './customers.html',
})
export class Customers implements OnInit {

    customers = signal<Customer[]>([]);

    constructor(private customerService: CustomerService) {
    }

    ngOnInit() {
        console.log('Customers oldal betöltődött');
        this.loadCustomers();
    }

    loadCustomers() {
        this.customerService.getAllCustomers().subscribe(data => {
            console.log('Kapott ügyfelek:', data);

            this.customers.set(data);
        });
    }

}