import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "App da Secretaria Escolar",
	description: "Interface para acesso da base de dados da escola.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-br" suppressHydrationWarning>
			<body className={`${inter.className} `}>
				<ThemeProvider>
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
								{children}
							</div>
						</SidebarInset>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
