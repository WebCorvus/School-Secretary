import type { StudentProps } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export function UserInfoCard({
	data,
	className,
}: {
	data: StudentProps;
	className?: string;
}) {
	return (
		<Card className={`w-full ${className}`}>
			<CardHeader>
				<CardTitle>Suas Informações</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col lg:flex-row gap-3">
					<div className="flex w-full lg:w-1/2 justify-center items-center">
						{data.photoUrl ? (
							<img
								src={data.photoUrl}
								alt="User Photo"
								className="h-80 object-cover border-1 border-[var(--primary)] shadow-md"
							/>
						) : (
							<User className="w-48 h-48 rounded-full border-4 border-[var(--primary)] shadow-md p-4" />
						)}
					</div>

					<div className="flex w-full lg:w-1/2 justify-center items-center">
						<ul className="space-y-2">
							<li>
								<strong>Nome:</strong> {data.full_name}
							</li>
							<li>
								<strong>Matrícula:</strong>{" "}
								{data.registration_number}
							</li>
							<li>
								<strong>Telefone:</strong> {data.phone_number}
							</li>
							<li>
								<strong>Email:</strong> {data.email}
							</li>
							<li>
								<strong>CPF:</strong> {data.cpf}
							</li>
							<li>
								<strong>Data de Nascimento:</strong>{" "}
								{data.birthday}
							</li>
							<li>
								<strong>Endereço:</strong> {data.address}
							</li>
							<li>
								<strong>Turma:</strong>{" "}
								{data.group_details?.full_name}
							</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
