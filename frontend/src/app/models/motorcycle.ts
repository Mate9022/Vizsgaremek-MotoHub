export interface Motorcycle {
    id: number;
    customer_id: number;
    brand: string;
    model: string;
    year: number | null;
    license_plate: string | null;
    vin: string | null;
    created_at: string;
    updated_at: string;
}