export interface LaborItem {
    id: number;
    work_order_id: number;
    description: string;
    hours: number;
    hourly_rate: number;
    total_price: number;
    created_at: string;
    updated_at: string;
}