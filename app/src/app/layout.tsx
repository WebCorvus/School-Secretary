import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import SiteHeader from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
							<SiteHeader />
							<main className="flex flex-1 flex-col gap-4 p-4">
								{children}
							</main>
							<Toaster />
						</SidebarInset>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
