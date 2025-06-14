import { GroupProps } from "./group";

export interface StudentProps {
	id: number;
	full_name: string;
	registration_number: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	group: number;
	group_details: GroupProps | undefined;
	created_at: string;
}

export type StudentPostProps = Omit<
	StudentProps,
	"id" | "created_at" | "group_details"
>;
