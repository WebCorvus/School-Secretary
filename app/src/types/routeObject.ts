import { faker } from '@faker-js/faker';

export interface LinkObjectProps {
	title: string;
	url: string;
}

export function createFakeLinkObject(): LinkObjectProps {
	return {
		title: faker.lorem.sentence(),
		url: faker.internet.url(),
	};
}

export const FakeLinkObject = createFakeLinkObject();
