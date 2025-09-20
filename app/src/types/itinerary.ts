import { faker } from '@faker-js/faker';

export interface ItineraryProps {
	id: number;
	short_name: string;
	full_name: string;
	created_at: string;
}

export type ItineraryPostProps = Omit<ItineraryProps, "id" | "created_at">;

export function createFakeItinerary(): ItineraryProps {
	return {
		id: faker.number.int(),
		short_name: faker.commerce.department().substring(0, 3).toUpperCase(),
		full_name: faker.commerce.department(),
		created_at: faker.date.past().toISOString().split('T')[0],
	};
}

export const FakeItinerary = createFakeItinerary();
