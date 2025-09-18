export interface ItineraryProps {
	id: number;
	short_name: string;
	full_name: string;
	created_at: string;
}

export type ItineraryPostProps = Omit<ItineraryProps, "id" | "created_at">;

export const FakeItinerary: ItineraryProps = {
	id: 1,
	short_name: "DS",
	full_name: "Desenvolvimento de Sistema",
	created_at: "2000-01-01",
};
