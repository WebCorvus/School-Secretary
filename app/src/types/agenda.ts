export interface AgendaItem {
    id: number;
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD
    time?: string; // HH:MM:SS
    created_at: string;
    updated_at: string;
}