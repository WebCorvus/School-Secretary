"use client";

import * as React from "react";

import { SearchForm } from "@/components/SearchForm";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";

import { Home, Inbox } from "lucide-react";

import { EXTERNAL_API_HOST, ADMIN_ROUTE } from "@/config";
import { Button } from "../ui/button";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";

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
			title: "Anúncios",
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
				{
					title: "Aulas",
					url: "/lessons",
				},
			],
		},
		{
			title: "Escola",
			url: "#",
			items: [
				{
					title: "Sobre",
					url: "/about",
				},
				{
					title: "Painel administrativo",
					url: `${EXTERNAL_API_HOST}${ADMIN_ROUTE}`,
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();

	function handleClick() {
		logout();
		router.push("/");
	}

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				<NavSecondary items={data.navSecondary} />
			</SidebarContent>
			<SidebarRail />
			<SidebarFooter>
				<Button variant={"outline"} onClick={() => handleClick()}>
					Logout
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
