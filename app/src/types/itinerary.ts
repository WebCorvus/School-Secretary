import { faker } from "@faker-js/faker";

export interface ItineraryProps {
  id: number;
  full_name: string;
  short_name: string;
  created_at: string;
}

export type ItineraryPostProps = Omit<ItineraryProps, "id" | "created_at">;

export function createFakeItinerary(): ItineraryProps {
  return {
    id: faker.number.int(),
    full_name: faker.lorem.words(3),
    short_name: faker.lorem.words(2),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeItinerary: ItineraryProps = createFakeItinerary();

export interface ItineraryCompactProps {
  id: number;
  short_name: string;
  full_name: string;
}

export function createFakeItineraryCompact(): ItineraryCompactProps {
  return {
    id: faker.number.int(),
    short_name: faker.lorem.words(2),
    full_name: faker.lorem.words(3),
  };
}

export const FakeItineraryCompact: ItineraryCompactProps = createFakeItineraryCompact();