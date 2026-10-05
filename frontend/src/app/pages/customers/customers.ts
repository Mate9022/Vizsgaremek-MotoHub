import {
    Component,
    OnInit,
    signal
} from '@angular/core';

import {
    FormsModule
} from '@angular/forms';

import {
    CustomerService
} from '../../services/customer';

import {
    Customer
} from '../../models/customer';


@Component({
    imports: [
        FormsModule
    ],

    selector: 'app-customers',

    styleUrl: './customers.css',

    templateUrl: './customers.html',
})
export class Customers implements OnInit {

    showForm = false;

    searchTerm = '';

    customers = signal<Customer[]>([]);

    editingCustomer = signal<Customer | null>(null);


    constructor(
        private customerService: CustomerService
    ) {
    }


    ngOnInit() {

        this.loadCustomers();

    }


    loadCustomers() {

        this.customerService
            .getAllCustomers()
            .subscribe({

                next: data => {

                    this.customers.set(data);

                },

                error: error => {

                    console.error(
                        'Hiba az ügyfelek lekérésekor:',
                        error
                    );

                    alert(
                        'Hiba történt az ügyfelek betöltése közben.'
                    );

                }

            });

    }


    get filteredCustomers(): Customer[] {

        const search = this.searchTerm
            .trim()
            .toLowerCase();


        if (!search) {
            return this.customers();
        }


        return this.customers().filter(
            customer =>
                customer.name
                    .toLowerCase()
                    .includes(search)

                ||

                (customer.phone || '')
                    .toLowerCase()
                    .includes(search)

                ||

                (customer.email || '')
                    .toLowerCase()
                    .includes(search)
        );

    }


    createCustomer(
        name: string,
        phone: string,
        email: string
    ) {

        if (!name.trim()) {

            alert(
                'A név megadása kötelező.'
            );

            return;

        }


        this.customerService
            .createCustomer(
                name.trim(),
                phone.trim(),
                email.trim()
            )
            .subscribe({

                next: newCustomer => {

                    this.customers.update(
                        customers => [
                            newCustomer,
                            ...customers
                        ]
                    );

                    this.showForm = false;

                },

                error: error => {

                    console.error(
                        'Hiba az ügyfél létrehozásakor:',
                        error
                    );

                    alert(
                        error.error?.message ||
                        'Hiba történt az ügyfél mentése közben.'
                    );

                }

            });

    }


    editCustomer(
        customer: Customer
    ) {

        this.editingCustomer.set(customer);

        this.showForm = true;

    }


    updateCustomer(
        name: string,
        phone: string,
        email: string
    ) {

        const customer =
            this.editingCustomer();


        if (!customer) {
            return;
        }


        if (!name.trim()) {

            alert(
                'A név megadása kötelező.'
            );

            return;

        }


        this.customerService
            .updateCustomer(
                customer.id,
                name.trim(),
                phone.trim(),
                email.trim()
            )
            .subscribe({

                next: updatedCustomer => {

                    this.customers.update(
                        customers =>
                            customers.map(
                                item =>
                                    item.id === updatedCustomer.id
                                        ? updatedCustomer
                                        : item
                            )
                    );

                    this.editingCustomer.set(null);

                    this.showForm = false;

                },

                error: error => {

                    console.error(
                        'Hiba az ügyfél módosításakor:',
                        error
                    );

                    alert(
                        error.error?.message ||
                        'Hiba történt az ügyfél módosítása közben.'
                    );

                }

            });

    }


    deleteCustomer(
        id: number
    ) {

        const customer =
            this.customers().find(
                item => item.id === id
            );


        if (!customer) {
            return;
        }


        if (
            !confirm(
                `Biztosan törölni szeretnéd a(z) "${customer.name}" ügyfelet?`
            )
        ) {

            return;

        }


        this.customerService
            .deleteCustomer(id)
            .subscribe({

                next: () => {

                    this.customers.update(
                        customers =>
                            customers.filter(
                                item =>
                                    item.id !== id
                            )
                    );

                },

                error: error => {

                    console.error(
                        'Hiba az ügyfél törlésekor:',
                        error
                    );

                    alert(
                        error.error?.message ||
                        'Hiba történt az ügyfél törlése közben.'
                    );

                }

            });

    }


    toggleForm() {

        this.showForm =
            !this.showForm;

        this.editingCustomer.set(null);

    }


    cancelForm() {

        this.showForm = false;

        this.editingCustomer.set(null);

    }

}