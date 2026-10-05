import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { WorkOrderService } from '../../services/work-order';
import { WorkOrder } from '../../models/work-order';

import { MotorcycleService } from '../../services/motorcycle';
import { Motorcycle } from '../../models/motorcycle';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';

import { PartItemService } from '../../services/part-item';
import { PartItem } from '../../models/part-item';

import { LaborItemService } from '../../services/labor-item';
import { LaborItem } from '../../models/labor-item';

interface WorkOrderWithMotorcycle extends WorkOrder {
    motorcycleName: string;
    ownerName: string;
}

@Component({
    imports: [],
    selector: 'app-work-orders',
    styleUrl: './work-orders.css',
    templateUrl: './work-orders.html',
})
export class WorkOrders implements OnInit {

    workOrders = signal<WorkOrderWithMotorcycle[]>([]);
    motorcycles = signal<Motorcycle[]>([]);
    customers = signal<Customer[]>([]);
    searchTerm = '';
    selectedStatus = '';

    partItems = signal<PartItem[]>([]);

    showPartForm = false;
    editingPartItem = signal<PartItem | null>(null);

    laborItems = signal<LaborItem[]>([]);

    showLaborForm = false;
    editingLaborItem = signal<LaborItem | null>(null);

    showForm = false;
    editMode = false;

    selectedWorkOrder = signal<WorkOrderWithMotorcycle | null>(null);

    statusLabels: Record<string, string> = {
        OPEN: 'Nyitott',
        IN_PROGRESS: 'Folyamatban',
        WAITING_PARTS: 'Alkatrészre vár',
        READY_FOR_PICKUP: 'Átadásra kész',
        COMPLETED: 'Befejezve'
    };

    constructor(
        private workOrderService: WorkOrderService,
        private motorcycleService: MotorcycleService,
        private customerService: CustomerService,
        private partItemService: PartItemService,
        private laborItemService: LaborItemService
    ) {
    }

    ngOnInit() {

        console.log('Munkalapok oldal betöltődött');

        this.loadWorkOrders();

    }

    loadWorkOrders() {

        forkJoin({
            workOrders: this.workOrderService.getAllWorkOrders(),
            motorcycles: this.motorcycleService.getAllMotorcycles(),
            customers: this.customerService.getAllCustomers()
        }).subscribe({

            next: data => {

                const workOrdersWithMotorcycles = data.workOrders.map(
                    workOrder => {

                        const motorcycle = data.motorcycles.find(
                            motorcycle =>
                                motorcycle.id === workOrder.motorcycle_id
                        );
                        const owner = motorcycle
                            ? data.customers.find(customer => customer.id === motorcycle.customer_id)
                            : undefined;

                        return {
                            ...workOrder,

                            motorcycleName: motorcycle
                                ? `${motorcycle.brand} ${motorcycle.model} (${motorcycle.license_plate || 'Nincs rendszám'})`
                                : 'Ismeretlen motorkerékpár',
                            ownerName: owner?.name || 'Ismeretlen tulajdonos'
                        };

                    }
                );

                console.log(
                    'Munkalapok motorkerékpárokkal:',
                    workOrdersWithMotorcycles
                );

                this.motorcycles.set(data.motorcycles);
                this.customers.set(data.customers);

                this.workOrders.set(workOrdersWithMotorcycles);

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a munkalapok adatainak lekérésekor:',
                    error
                );

            }

        });

    }

    filteredWorkOrders() {
        const search = this.searchTerm.trim().toLocaleLowerCase('hu');
        return this.workOrders().filter(workOrder => {
            const matchesSearch = !search || [
                String(workOrder.id),
                workOrder.motorcycleName,
                workOrder.ownerName,
                workOrder.description
            ].some(value => value.toLocaleLowerCase('hu').includes(search));
            return matchesSearch && (!this.selectedStatus || workOrder.status === this.selectedStatus);
        });
    }

    laborTotal() {
        return this.laborItems().reduce((total, item) => total + item.hours * item.hourly_rate, 0);
    }

    partTotal() {
        return this.partItems().reduce((total, item) => total + item.quantity * item.unit_price, 0);
    }

    workOrderTotal() {
        return this.laborTotal() + this.partTotal();
    }

    formatMoney(amount: number) {
        return new Intl.NumberFormat('hu-HU', {
            maximumFractionDigits: 2
        }).format(amount);
    }

    startNewWorkOrder() {
        this.selectedWorkOrder.set(null);
        this.partItems.set([]);
        this.laborItems.set([]);
        this.showPartForm = false;
        this.showLaborForm = false;
        this.editingPartItem.set(null);
        this.editingLaborItem.set(null);
        this.editMode = false;
        this.showForm = true;
    }

    viewWorkOrder(workOrder: WorkOrderWithMotorcycle) {

        this.selectedWorkOrder.set(workOrder);

        this.editingPartItem.set(null);
        this.showPartForm = false;

        this.editingLaborItem.set(null);
        this.showLaborForm = false;
        this.laborItems.set([]);

        this.partItemService
            .getPartItemsByWorkOrder(workOrder.id)
            .subscribe({

                next: data => {

                    console.log(
                        'Munkalap alkatrészei:',
                        data
                    );

                    this.partItems.set(data);

                },

                error: (error: HttpErrorResponse) => {

                    console.error(
                        'Hiba az alkatrészek lekérésekor:',
                        error
                    );

                    this.partItems.set([]);

                }

            });

        this.laborItemService
            .getLaborItemsByWorkOrder(workOrder.id)
            .subscribe({

                next: data => {

                    console.log(
                        'Munkalap munkadíjai:',
                        data
                    );

                    this.laborItems.set(data);

                },

                error: (error: HttpErrorResponse) => {

                    console.error(
                        'Hiba a munkadíjak lekérésekor:',
                        error
                    );

                    this.laborItems.set([]);

                }

            });

    }

    editWorkOrder() {

        const workOrder = this.selectedWorkOrder();

        if (!workOrder) {
            return;
        }

        this.editMode = true;
        this.showForm = true;

    }

    deleteWorkOrder() {

        const workOrder = this.selectedWorkOrder();

        if (!workOrder) {
            return;
        }

        if (!confirm(
            `Biztosan törölni szeretnéd a #${workOrder.id} munkalapot?`
        )) {
            return;
        }

        this.workOrderService.deleteWorkOrder(workOrder.id).subscribe({

            next: () => {

                console.log(
                    'Munkalap törölve:',
                    workOrder.id
                );

                this.workOrders.update(
                    workOrders =>
                        workOrders.filter(
                            item => item.id !== workOrder.id
                        )
                );

                this.selectedWorkOrder.set(null);

                this.partItems.set([]);
                this.showPartForm = false;
                this.editingPartItem.set(null);

                this.showForm = false;
                this.editMode = false;

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a munkalap törlésekor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt a munkalap törlése közben.'
                );

            }

        });

    }

    updateWorkOrder(
        motorcycleId: string,
        description: string,
        status: string,
        form: HTMLFormElement
    ) {

        const workOrder = this.selectedWorkOrder();

        if (!workOrder) {
            return;
        }

        const motorcycleIdNumber = Number(motorcycleId);

        if (!motorcycleIdNumber) {
            alert('A motorkerékpár kiválasztása kötelező.');
            return;
        }

        if (!description.trim()) {
            alert('A leírás megadása kötelező.');
            return;
        }

        this.workOrderService.updateWorkOrder(
            workOrder.id,
            motorcycleIdNumber,
            description.trim(),
            status
        ).subscribe({

            next: updatedWorkOrder => {

                console.log(
                    'Munkalap módosítva:',
                    updatedWorkOrder
                );

                const motorcycle = this.motorcycles().find(
                    motorcycle =>
                        motorcycle.id === updatedWorkOrder.motorcycle_id
                );
                const owner = motorcycle
                    ? this.customers().find(customer => customer.id === motorcycle.customer_id)
                    : undefined;

                const workOrderWithMotorcycle:
                    WorkOrderWithMotorcycle = {

                    ...updatedWorkOrder,

                    motorcycleName: motorcycle
                        ? `${motorcycle.brand} ${motorcycle.model} (${motorcycle.license_plate || 'Nincs rendszám'})`
                        : 'Ismeretlen motorkerékpár',
                    ownerName: owner?.name || 'Ismeretlen tulajdonos'

                };

                this.workOrders.update(
                    workOrders =>
                        workOrders.map(workOrder =>
                            workOrder.id === updatedWorkOrder.id
                                ? workOrderWithMotorcycle
                                : workOrder
                        )
                );

                this.selectedWorkOrder.set(
                    workOrderWithMotorcycle
                );

                form.reset();

                this.showForm = false;
                this.editMode = false;

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a munkalap módosításakor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt a munkalap módosítása közben.'
                );

            }

        });

    }

    createWorkOrder(
        motorcycleId: string,
        description: string,
        status: string,
        form: HTMLFormElement
    ) {

        const motorcycleIdNumber = Number(motorcycleId);

        if (!motorcycleIdNumber) {
            alert('A motorkerékpár kiválasztása kötelező.');
            return;
        }

        if (!description.trim()) {
            alert('A leírás megadása kötelező.');
            return;
        }

        this.workOrderService.createWorkOrder(
            motorcycleIdNumber,
            description.trim(),
            status
        ).subscribe({

            next: newWorkOrder => {

                console.log(
                    'Új munkalap létrehozva:',
                    newWorkOrder
                );

                const motorcycle = this.motorcycles().find(
                    motorcycle =>
                        motorcycle.id === newWorkOrder.motorcycle_id
                );
                const owner = motorcycle
                    ? this.customers().find(customer => customer.id === motorcycle.customer_id)
                    : undefined;

                const workOrderWithMotorcycle:
                    WorkOrderWithMotorcycle = {

                    ...newWorkOrder,

                    motorcycleName: motorcycle
                        ? `${motorcycle.brand} ${motorcycle.model} (${motorcycle.license_plate || 'Nincs rendszám'})`
                        : 'Ismeretlen motorkerékpár',
                    ownerName: owner?.name || 'Ismeretlen tulajdonos'

                };

                this.workOrders.update(
                    workOrders => [
                        workOrderWithMotorcycle,
                        ...workOrders
                    ]
                );

                form.reset();

                this.selectedWorkOrder.set(null);
                this.partItems.set([]);
                this.showPartForm = false;
                this.editingPartItem.set(null);

                this.showForm = false;
                this.editMode = false;

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba a munkalap létrehozásakor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt a munkalap mentése közben.'
                );

            }

        });

    }

    addPartItem(
        name: string,
        quantity: string,
        unitPrice: string,
        form: HTMLFormElement
    ) {

        const workOrder = this.selectedWorkOrder();

        if (!workOrder) {
            return;
        }

        const quantityNumber = Number(quantity);
        const unitPriceNumber = Number(unitPrice);

        if (!name.trim()) {
            alert('Az alkatrész neve kötelező.');
            return;
        }

        if (!quantityNumber || quantityNumber <= 0) {
            alert('A mennyiségnek pozitív számnak kell lennie.');
            return;
        }

        if (!unitPriceNumber || unitPriceNumber <= 0) {
            alert('Az egységárnak pozitív számnak kell lennie.');
            return;
        }

        this.partItemService.createPartItem(
            workOrder.id,
            name.trim(),
            quantityNumber,
            unitPriceNumber
        ).subscribe({

            next: newPartItem => {

                console.log(
                    'Új alkatrész hozzáadva:',
                    newPartItem
                );

                this.partItems.update(
                    partItems => [
                        newPartItem,
                        ...partItems
                    ]
                );

                form.reset();

                this.showPartForm = false;
                this.editingPartItem.set(null);

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba az alkatrész hozzáadásakor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt az alkatrész mentése közben.'
                );

            }

        });

    }

    editPartItem(partItem: PartItem) {

        this.editingPartItem.set(partItem);
        this.showPartForm = true;

    }

    updatePartItem(
        name: string,
        quantity: string,
        unitPrice: string,
        form: HTMLFormElement
    ) {

        const partItem = this.editingPartItem();

        if (!partItem) {
            return;
        }

        const quantityNumber = Number(quantity);
        const unitPriceNumber = Number(unitPrice);

        if (!name.trim()) {
            alert('Az alkatrész neve kötelező.');
            return;
        }

        if (!quantityNumber || quantityNumber <= 0) {
            alert('A mennyiségnek pozitív számnak kell lennie.');
            return;
        }

        if (!unitPriceNumber || unitPriceNumber <= 0) {
            alert('Az egységárnak pozitív számnak kell lennie.');
            return;
        }

        this.partItemService.updatePartItem(
            partItem.id,
            partItem.work_order_id,
            name.trim(),
            quantityNumber,
            unitPriceNumber
        ).subscribe({

            next: updatedPartItem => {

                console.log(
                    'Alkatrész módosítva:',
                    updatedPartItem
                );

                this.partItems.update(
                    partItems =>
                        partItems.map(item =>
                            item.id === updatedPartItem.id
                                ? updatedPartItem
                                : item
                        )
                );

                form.reset();

                this.editingPartItem.set(null);
                this.showPartForm = false;

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba az alkatrész módosításakor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt az alkatrész módosítása közben.'
                );

            }

        });

    }

    addLaborItem(
    description: string,
    hours: string,
    hourlyRate: string,
    form: HTMLFormElement
) {

    const workOrder = this.selectedWorkOrder();

    if (!workOrder) {
        return;
    }

    const hoursNumber = Number(hours);
    const hourlyRateNumber = Number(hourlyRate);

    if (!description.trim()) {
        alert('A munkadíj leírása kötelező.');
        return;
    }

    if (!hoursNumber || hoursNumber <= 0) {
        alert('Az óraszámnak pozitív számnak kell lennie.');
        return;
    }

    if (!hourlyRateNumber || hourlyRateNumber <= 0) {
        alert('Az óradíjnak pozitív számnak kell lennie.');
        return;
    }

    this.laborItemService.createLaborItem(
        workOrder.id,
        description.trim(),
        hoursNumber,
        hourlyRateNumber
    ).subscribe({

        next: newLaborItem => {

            console.log(
                'Új munkadíj hozzáadva:',
                newLaborItem
            );

            this.laborItems.update(
                laborItems => [
                    newLaborItem,
                    ...laborItems
                ]
            );

            form.reset();

            this.showLaborForm = false;
            this.editingLaborItem.set(null);

        },

        error: (error: HttpErrorResponse) => {

            console.error(
                'Hiba a munkadíj hozzáadásakor:',
                error
            );

            alert(
                error.error?.message ||
                'Hiba történt a munkadíj mentése közben.'
            );

        }

    });

}

    editLaborItem(laborItem: LaborItem) {

    this.editingLaborItem.set(laborItem);
    this.showLaborForm = true;

}

    updateLaborItem(
    description: string,
    hours: string,
    hourlyRate: string,
    form: HTMLFormElement
) {

    const laborItem = this.editingLaborItem();

    if (!laborItem) {
        return;
    }

    const hoursNumber = Number(hours);
    const hourlyRateNumber = Number(hourlyRate);

    if (!description.trim()) {
        alert('A munkadíj leírása kötelező.');
        return;
    }

    if (!hoursNumber || hoursNumber <= 0) {
        alert('Az óraszámnak pozitív számnak kell lennie.');
        return;
    }

    if (!hourlyRateNumber || hourlyRateNumber <= 0) {
        alert('Az óradíjnak pozitív számnak kell lennie.');
        return;
    }

    this.laborItemService.updateLaborItem(
        laborItem.id,
        laborItem.work_order_id,
        description.trim(),
        hoursNumber,
        hourlyRateNumber
    ).subscribe({

        next: updatedLaborItem => {

            console.log(
                'Munkadíj módosítva:',
                updatedLaborItem
            );

            this.laborItems.update(
                laborItems =>
                    laborItems.map(item =>
                        item.id === updatedLaborItem.id
                            ? updatedLaborItem
                            : item
                    )
            );

            form.reset();

            this.editingLaborItem.set(null);
            this.showLaborForm = false;

        },

        error: (error: HttpErrorResponse) => {

            console.error(
                'Hiba a munkadíj módosításakor:',
                error
            );

            alert(
                error.error?.message ||
                'Hiba történt a munkadíj módosítása közben.'
            );

        }

    });

}

    deleteLaborItem(id: number) {

    if (!confirm(
        'Biztosan törölni szeretnéd ezt a munkadíjat?'
    )) {
        return;
    }

    this.laborItemService.deleteLaborItem(id).subscribe({

        next: () => {

            console.log(
                'Munkadíj törölve:',
                id
            );

            this.laborItems.update(
                laborItems =>
                    laborItems.filter(
                        item => item.id !== id
                    )
            );

            if (
                this.editingLaborItem()?.id === id
            ) {
                this.editingLaborItem.set(null);
                this.showLaborForm = false;
            }

        },

        error: (error: HttpErrorResponse) => {

            console.error(
                'Hiba a munkadíj törlésekor:',
                error
            );

            alert(
                error.error?.message ||
                'Hiba történt a munkadíj törlése közben.'
            );

        }

    });

}

    deletePartItem(id: number) {

        if (!confirm(
            'Biztosan törölni szeretnéd ezt az alkatrészt?'
        )) {
            return;
        }

        this.partItemService.deletePartItem(id).subscribe({

            next: () => {

                console.log(
                    'Alkatrész törölve:',
                    id
                );

                this.partItems.update(
                    partItems =>
                        partItems.filter(
                            item => item.id !== id
                        )
                );

                if (
                    this.editingPartItem()?.id === id
                ) {
                    this.editingPartItem.set(null);
                    this.showPartForm = false;
                }

            },

            error: (error: HttpErrorResponse) => {

                console.error(
                    'Hiba az alkatrész törlésekor:',
                    error
                );

                alert(
                    error.error?.message ||
                    'Hiba történt az alkatrész törlése közben.'
                );

            }

        });

    }

}
