import { faker } from "@faker-js/faker";

export interface NotificationProps {
  id: number;
  recipient: number;
  recipient_name?: string;
  notification_type:
  | "GRADE"
  | "ABSENCE"
  | "WARNING"
  | "SUSPENSION"
  | "EVENT"
  | "ASSIGNMENT"
  | "EXAM"
  | "PAYMENT"
  | "GENERAL";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function createFakeNotifications(): NotificationProps {
  return {
    id: faker.number.int(),
    recipient: faker.number.int(),
    recipient_name: faker.lorem.word(6),
    notification_type: faker.helpers.arrayElement([
      "GRADE",
      "ABSENCE",
      "WARNING",
      "SUSPENSION",
      "EVENT",
      "ASSIGNMENT",
      "EXAM",
      "PAYMENT",
      "GENERAL",
    ]),
    title: faker.lorem.word(7),
    message: faker.lorem.words(20),
    read: faker.datatype.boolean(),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeNotification: NotificationProps = createFakeNotifications();
