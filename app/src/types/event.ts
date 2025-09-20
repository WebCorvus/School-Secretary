import { faker } from "@faker-js/faker";

export interface EventProps {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export type EventPostProps = Omit<EventProps, "id" | "created_at" | "updated_at">;

export function createFakeEvent(): EventProps {
  return {
    id: faker.number.int(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    location: faker.location.streetAddress(),
    start_date: faker.date.future().toISOString().split("T")[0],
    end_date: faker.date.future().toISOString().split("T")[0],
    start_time: faker.date.future().toTimeString().split(" ")[0].substring(0, 5),
    end_time: faker.date.future().toTimeString().split(" ")[0].substring(0, 5),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  };
}

export const FakeEvent: EventProps = createFakeEvent();