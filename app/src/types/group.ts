import { FakeItinerary, ItineraryProps } from "./itinerary";
import { LessonProps } from "./lesson";

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

export type DailyLessonsViewProps = {
	day: number;
	lessons: LessonProps[];
};

export const FakeGroup = {
	id: 1,
	full_name: "Desenvolvimento de Sistemas",
	short_name: "DS",
	itinerary: 1,
	itinerary_details: FakeItinerary,
	created_at: "2000-01-01",
};
