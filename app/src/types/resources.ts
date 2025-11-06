import { faker } from "@faker-js/faker";

export enum ResourceType {
	COMPUTER = "COMPUTER",
	BOOK = "BOOK",
	EQUIPMENT = "EQUIPMENT",
	OTHER = "OTHER",
}

export enum ResourceStatus {
	AVAILABLE = "AVAILABLE",
	IN_USE = "IN_USE",
	MAINTENANCE = "MAINTENANCE",
	UNAVAILABLE = "UNAVAILABLE",
}

export interface ResourceProps {
	id: number;
	name: string;
	resource_type: ResourceType;
	description?: string;
	status: ResourceStatus;
	created_at: string;
}

export function createFakeResource(): ResourceProps {
	return {
		id: faker.number.int(),
		name: faker.commerce.productName(),
		resource_type: faker.helpers.arrayElement(Object.values(ResourceType)),
		description: faker.lorem.sentence(),
		status: faker.helpers.arrayElement(Object.values(ResourceStatus)),
		created_at: faker.date.past().toISOString(),
	};
}

export interface ResourceLoanProps {
	id: number;
	resource: number;
	student: number;
	loan_date: string;
	return_date: string;
	actual_return_date?: string;
	created_at: string;
}

export function createFakeResourceLoan(): ResourceLoanProps {
	const loanDate = faker.date.past();
	const returnDate = faker.date.future({ years: 1, refDate: loanDate });
	const actualReturnDate = faker.helpers.arrayElement([
		undefined,
		faker.date.future({ years: 1, refDate: loanDate }),
	]);

	return {
		id: faker.number.int(),
		resource: faker.number.int(),
		student: faker.number.int(),
		loan_date: loanDate.toISOString().split("T")[0],
		return_date: returnDate.toISOString().split("T")[0],
		actual_return_date: actualReturnDate
			? actualReturnDate.toISOString().split("T")[0]
			: undefined,
		created_at: faker.date.past().toISOString(),
	};
}
