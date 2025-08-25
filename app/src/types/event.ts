export interface Event {
    id: number;
    title: string;
    description?: string;
    start_date: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    start_time?: string; // HH:MM:SS
    end_time?: string; // HH:MM:SS
    location?: string;
    created_at: string;
    updated_at: string;
}