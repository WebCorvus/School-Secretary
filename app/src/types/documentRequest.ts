import { faker } from '@faker-js/faker';

export interface DocumentRequest {
	title: string;
	type: string;
}

export function createFakeDocumentRequest(): DocumentRequest {
	return {
		title: faker.lorem.sentence(),
		type: faker.helpers.arrayElement(['SUSPENSION', 'TRANSFER', 'ENROLLMENT']),
	};
}

export const FakeDocumentRequest = createFakeDocumentRequest();
