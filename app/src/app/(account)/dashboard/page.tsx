import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Header1 } from "@/components/Header1";
import { Header2 } from "@/components/Header2";

export default function Page() {
	return (
		<div>
			<Header1 text="Dasboard" />
			<Header2 text="Header 2" />
			<div className="flex flex-row gap-3">
				<Card className="w-1/2">
					<CardHeader>
						<CardTitle>Suas Permissões no Sistema</CardTitle>
						<CardDescription>
							Identificam as operações que tem permissão de
							realizar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p></p>
					</CardContent>
				</Card>
				<Card className="w-1/2">
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>Card Description</CardDescription>
					</CardHeader>
					<CardContent>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Donec fringilla dapibus purus, ut tincidunt
							elit euismod ut. Phasellus volutpat velit quis nisi
							lobortis euismod. Maecenas in auctor lacus. Cras
							posuere vehicula nisl nec suscipit. Donec sodales
							varius magna. Pellentesque ac tortor dui.
							Pellentesque molestie, diam non mollis sodales, urna
							sem pharetra ex, non tincidunt urna ante ut elit.
							Vivamus tempus mi eros, eget pellentesque ligula
							egestas et. Nam ullamcorper porta ex sed blandit.
							Pellentesque eleifend quam non nulla fermentum
							mattis. Ut fermentum tempor arcu eget congue.
							Integer laoreet sem vitae ultricies gravida. Aenean
							egestas leo quis gravida aliquet. Pellentesque
							scelerisque.{" "}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
