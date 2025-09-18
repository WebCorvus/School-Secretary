export interface EventProps {
	id: number;
	title: string;
	description?: string;
	start_date: string;
	end_date?: string;
	start_time?: string;
	end_time?: string;
	location?: string;
	created_at: string;
	updated_at: string;
}

export type EventPostProps = Omit<
	EventProps,
	"id" | "created_at" | "updated_at"
>;

export const FakeEvent: EventProps = {
	id: 1,
	title: "Título de teste",
	description: "Descrição de teste",
	start_date: "2000-01-01",
	end_date: "2000-01-01",
	start_time: "22:00:00",
	end_time: "22:00:00",
	location: "Localização de teste",
	created_at: "2000-01-01",
	updated_at: "2000-01-01",
};
