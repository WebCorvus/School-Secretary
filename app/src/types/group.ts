import { createFakeItinerary, ItineraryProps } from "./itinerary";
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

export function createFakeGroup(): GroupProps {
	return {
		id: faker.number.int(),
		full_name: faker.commerce.department() + " " + faker.lorem.words(2),
		short_name: faker.commerce.department().substring(0, 3).toUpperCase(),
		itinerary: faker.number.int(),
		itinerary_details: createFakeItinerary(),
		created_at: faker.date.past().toISOString().split("T")[0],
	};
}

export const FakeGroup = createFakeGroup();
