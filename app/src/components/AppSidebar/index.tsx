import * as React from "react";

import { SearchForm } from "@/components/SearchForm";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Item } from "@radix-ui/react-dropdown-menu";

const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Usuários Cadastrados",
			url: "#",
			items: [
				{
					title: "Professores",
					url: "/professors",
				},
				{
					title: "Alunos",
					url: "/students",
				},
			],
		},
		{
			title: "Publicar",
			url: "#",
			items: [
				{
					title: "Atividades",
					url: "/agenda",
				},
				{
					title: "Eventos",
					url: "/events",
				},
			],
		},
		{
			title: "Escola",
			url: "#",
			items: [
				{
					title: "Turmas",
					url: "/groups",
				},
				{
					title: "Itinerários",
					url: "/itineraries",
				},
				{
					title: "Aulas",
					url: "/lessons",
				},
				{
					title: "Matérias",
					url: "/subjects",
				},
			],
		},
		{
			title: "Marketing",
			url: "#",
			items: [
				{
					title: "Sobre",
					url: "/about",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SearchForm />
			</SidebarHeader>
			<SidebarContent>
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={item.isActive}
										>
											<a href={item.url}>{item.title}</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
