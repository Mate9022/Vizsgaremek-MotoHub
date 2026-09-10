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

    showForm = false;

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

    createCustomer(name: string, phone: string, email: string) {

    if (!name.trim()) {
        alert('A név megadása kötelező.');
        return;
    }

    this.customerService.createCustomer(name, phone, email).subscribe({
        next: newCustomer => {
            console.log('Új ügyfél létrehozva:', newCustomer);

            this.customers.update(customers => [newCustomer, ...customers]);

            this.showForm = false;
        },
        error: error => {
            console.error('Hiba az ügyfél létrehozásakor:', error);

            alert('Hiba történt az ügyfél mentése közben.');
        }
    });
}

deleteCustomer(id: number) {

    if (!confirm('Biztosan törölni szeretnéd ezt az ügyfelet?')) {
        return;
    }

    this.customerService.deleteCustomer(id).subscribe({
        next: () => {
            console.log('Ügyfél törölve:', id);

            this.customers.update(customers =>
                customers.filter(customer => customer.id !== id)
            );
        },
        error: error => {
            console.error('Hiba az ügyfél törlésekor:', error);

            alert('Hiba történt az ügyfél törlése közben.');
        }
    });
}

}