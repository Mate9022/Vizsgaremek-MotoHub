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

    editingMotorcycle = signal<MotorcycleWithOwner | null>(null);

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

        createMotorcycle(
        customerId: string,
        brand: string,
        model: string,
        modelYear: string,
        licensePlate: string,
        vin: string,
        form: HTMLFormElement
    ) {

        const customerIdNumber = Number(customerId);

        const modelYearNumber = modelYear
            ? Number(modelYear)
            : null;

        this.motorcycleService.createMotorcycle(
            customerIdNumber,
            brand.trim(),
            model.trim(),
            modelYearNumber,
            licensePlate.trim(),
            vin.trim()
        ).subscribe({

            next: newMotorcycle => {

                console.log(
                    'Új motorkerékpár létrehozva:',
                    newMotorcycle
                );

                const owner = this.customers().find(
                    customer => customer.id === newMotorcycle.customer_id
                );

                const motorcycleWithOwner: MotorcycleWithOwner = {
                    ...newMotorcycle,
                    customerName: owner
                        ? owner.name
                        : 'Ismeretlen tulajdonos'
                };

                this.motorcycles.update(
                    motorcycles => [
                        motorcycleWithOwner,
                        ...motorcycles
                    ]
                );

                form.reset();

                this.showForm = false;
            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a motorkerékpár létrehozásakor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt a motorkerékpár mentése közben.'
                );

            }

        });

    }

    deleteMotorcycle(id: number) {

        if (!confirm('Biztosan törölni szeretnéd ezt a motorkerékpárt?')) {
            return;
        }

        this.motorcycleService.deleteMotorcycle(id).subscribe({

            next: () => {

                console.log(
                    'Motorkerékpár törölve:',
                    id
                );

                this.motorcycles.update(
                    motorcycles =>
                        motorcycles.filter(
                            motorcycle => motorcycle.id !== id
                        )
                );

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a motorkerékpár törlésekor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt a motorkerékpár törlése közben.'
                );

            }

        });

    }

    editMotorcycle(motorcycle: MotorcycleWithOwner) {

    this.editingMotorcycle.set(motorcycle);
    this.showForm = true;

    }

    saveMotorcycle(
    customerId: string,
    brand: string,
    model: string,
    modelYear: string,
    licensePlate: string,
    vin: string,
    form: HTMLFormElement
) {

    const motorcycle = this.editingMotorcycle();

    if (!motorcycle) {
        return;
    }

    const customerIdNumber = Number(customerId);

    const modelYearNumber = modelYear
        ? Number(modelYear)
        : null;

    this.motorcycleService.updateMotorcycle(
        motorcycle.id,
        customerIdNumber,
        brand.trim(),
        model.trim(),
        modelYearNumber,
        licensePlate.trim(),
        vin.trim()
    ).subscribe({

        next: updatedMotorcycle => {

            const owner = this.customers().find(
                customer => customer.id === updatedMotorcycle.customer_id
            );

            const motorcycleWithOwner: MotorcycleWithOwner = {
                ...updatedMotorcycle,
                customerName: owner
                    ? owner.name
                    : 'Ismeretlen tulajdonos'
            };

            this.motorcycles.update(
                motorcycles =>
                    motorcycles.map(motorcycle =>
                        motorcycle.id === updatedMotorcycle.id
                            ? motorcycleWithOwner
                            : motorcycle
                    )
            );

            form.reset();

            this.editingMotorcycle.set(null);
            this.showForm = false;

        },

        error: (error: HttpErrorResponse) => {

            console.error(
                'Hiba a motorkerékpár módosításakor:',
                error
            );

            alert(
                error.error?.message ||
                'Hiba történt a motorkerékpár módosítása közben.'
            );

        }

    });

    }

}