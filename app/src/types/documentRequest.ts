import { faker } from '@faker-js/faker';

export interface DocumentRequest {
	title: string;
	type: string;
}

export const FakeDocumentRequest: DocumentRequest = {
	title: faker.lorem.sentence(),
	type: faker.helpers.arrayElement(['SUSPENSION', 'TRANSFER', 'ENROLLMENT']),
};
