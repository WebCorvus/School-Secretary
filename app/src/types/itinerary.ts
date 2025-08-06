export interface ItineraryProps {
	id: number;
	short_name: string;
	full_name: string;
	created_at: string;
}

export type ItineraryPostProps = Omit<ItineraryProps, "id" | "created_at">;
