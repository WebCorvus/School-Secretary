import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface LoginFormProps extends React.ComponentProps<"form"> {
	error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	className,
	error,
	...props
}) => {
	return (
		<form className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Faça seu login</CardTitle>
					<CardDescription>
						Insira email e senha abaixo para acessar sua conta
					</CardDescription>
					{error && (
						<div className="text-[var(--danger)] text-sm mt-2">
							{error}
						</div>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="exemplo@email.com"
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="********"
								required
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Button type="submit" className="w-full">
								Login
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</form>
	);
};
