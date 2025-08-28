export interface Event {
	id: number;
	title: string;
	description?: string;
	start_date: string;
	end_date?: string;
	start_time?: string;
	end_time?: string;
	location?: string;
	created_at: string;
	updated_at: string;
}
