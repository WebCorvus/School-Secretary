"use client";

import * as React from "react";

import { SearchForm } from "@/components/SearchForm";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";

import { Home, Inbox } from "lucide-react";

const data = {
	navMain: [
		{
			title: "Início",
			url: "/dashboard",
			icon: Home,
		},
		{
			// TODO create inbox
			title: "Notificações",
			url: "/inbox",
			icon: Inbox,
		},
	],
	navSecondary: [
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
				{/* TODO make this search form functional */}
				<SearchForm />
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				<NavSecondary items={data.navSecondary} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
