import { ItineraryProps } from "./itinerary";

export interface GroupProps {
	id: number;
	full_name: string;
	short_name: string;
	itinerary: number;
	itinerary_details: ItineraryProps | undefined;
	created_at: string;
}

export type GroupPostProps = Omit<
	GroupProps,
	"id" | "itinerary_details" | "created_at"
>;
