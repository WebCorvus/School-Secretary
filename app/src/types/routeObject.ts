import { faker } from '@faker-js/faker';

export interface LinkObjectProps {
	title: string;
	url: string;
}

export const FakeLinkObject: LinkObjectProps = {
	title: faker.lorem.sentence(),
	url: faker.internet.url(),
};
