import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function SiteHeader() {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2">
			<div className="flex flex-1 items-center gap-2 px-3">
				<SidebarTrigger />
			</div>
			<div className="ml-auto px-3">
				<ThemeSwitcher />
			</div>
		</header>
	);
}
