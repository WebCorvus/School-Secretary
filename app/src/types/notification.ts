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

export const FakeNotification: NotificationProps = {
	id: 0,
	recipient: 0,
	recipient_name: "Usuário Teste",
	notification_type: "GENERAL",
	title: "Notificação de Teste",
	message: "Esta é uma notificação de teste do sistema.",
	read: false,
	created_at: new Date().toISOString(),
};
