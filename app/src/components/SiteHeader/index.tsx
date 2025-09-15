import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";

export default function SiteHeader() {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2">
			<div className="flex flex-1 items-center gap-2 px-3">
				<SidebarTrigger />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">Secretaria Escolar</h1>
			</div>
			<div className="ml-auto px-3">
				<ThemeSwitcher />
			</div>
		</header>
	);
}
