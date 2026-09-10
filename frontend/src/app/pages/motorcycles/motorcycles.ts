import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { MotorcycleService } from '../../services/motorcycle';
import { CustomerService } from '../../services/customer';

import { Motorcycle } from '../../models/motorcycle';
import { Customer } from '../../models/customer';

interface MotorcycleWithOwner extends Motorcycle {
    customerName: string;
}

@Component({
    imports: [],
    selector: 'app-motorcycles',
    styleUrl: './motorcycles.css',
    templateUrl: './motorcycles.html',
})
export class Motorcycles implements OnInit {

    showForm = false;

motorcycles = signal<MotorcycleWithOwner[]>([]);
customers = signal<Customer[]>([]);

    constructor(
        private motorcycleService: MotorcycleService,
        private customerService: CustomerService
    ) {
    }

    ngOnInit() {
    console.log('Motorkerékpárok oldal betöltődött');

    this.loadMotorcycles();
    this.loadCustomers();
}

    loadCustomers() {

    this.customerService.getAllCustomers().subscribe({
        next: data => {

            console.log('Betöltött ügyfelek:', data);

            this.customers.set(data);
        },

        error: (error: HttpErrorResponse) => {

            console.error(
                'Hiba az ügyfelek lekérésekor:',
                error
            );

        }
    });

}

    loadMotorcycles() {

        forkJoin({
            motorcycles: this.motorcycleService.getAllMotorcycles(),
            customers: this.customerService.getAllCustomers()
        }).subscribe({
            next: data => {

                const motorcycles = data.motorcycles;
                const customers = data.customers;

                const motorcyclesWithOwners = motorcycles.map(motorcycle => {

                    const owner = customers.find(
                        customer => customer.id === motorcycle.customer_id
                    );

                    return {
                        ...motorcycle,
                        customerName: owner
                            ? owner.name
                            : 'Ismeretlen tulajdonos'
                    };

                });

                console.log(
                    'Motorkerékpárok tulajdonosokkal:',
                    motorcyclesWithOwners
                );

                this.motorcycles.set(motorcyclesWithOwners);
            },

            error: (error: HttpErrorResponse) => {
                console.error(
                    'Hiba a motorkerékpárok adatainak lekérésekor:',
                    error
                );
            }
        });

    }

}