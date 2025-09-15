"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
					</div>
					<div className="ml-auto px-3">
						<ThemeSwitcher />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
					</div>
					<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
