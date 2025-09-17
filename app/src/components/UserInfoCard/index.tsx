import type { StudentProps } from "@/types/student";
import { Paragraph } from "@/components/Paragraph";
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
				<div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8">
					<div className="flex justify-center items-center w-full lg:w-1/2">
						{data.photoUrl ? (
							<img
								src={data.photoUrl}
								alt="User Photo"
								className="w-48 h-48 object-cover rounded-full"
							/>
						) : (
							<User className="w-48 h-48 object-cover rounded-full" />
						)}
					</div>

					<div className="flex justify-center items-center w-full lg:w-1/2">
						<ul className="space-y-2">
							<li>
								<Paragraph text={`Nome: ${data.full_name}`} />
							</li>
							<li>
								<Paragraph
									text={`Matrícula: ${data.registration_number}`}
								/>
							</li>
							<li>
								<Paragraph
									text={`Telefone: ${data.phone_number}`}
								/>
							</li>
							<li>
								<Paragraph text={`Email: ${data.email}`} />
							</li>
							<li>
								<Paragraph text={`CPF: ${data.cpf}`} />
							</li>
							<li>
								<Paragraph
									text={`Data de Nascimento: ${data.birthday}`}
								/>
							</li>
							<li>
								<Paragraph text={`Endereço: ${data.address}`} />
							</li>
							<li>
								<Paragraph
									text={`Turma: ${data.group_details?.full_name}`}
								/>
							</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
