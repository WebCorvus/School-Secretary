import { FakeItinerary, ItineraryProps } from "./itinerary";
import { LessonProps } from "./lesson";
import { faker } from "@faker-js/faker";

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

export const FakeGroup: GroupProps = {
	id: faker.number.int(),
	full_name: faker.commerce.department() + " " + faker.lorem.words(2),
	short_name: faker.commerce.department().substring(0, 3).toUpperCase(),
	itinerary: faker.number.int(),
	itinerary_details: FakeItinerary,
	created_at: faker.date.past().toISOString().split("T")[0],
};
