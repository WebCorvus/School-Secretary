import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "App da Secretaria Escolar",
	description: "Interface para acesso da base de dados da escola.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br" suppressHydrationWarning>
			<body className={inter.className}>
				<div className="flex h-screen">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						<main className="flex-grow overflow-y-auto">
							{children}
						</main>
						<Footer />
					</ThemeProvider>
				</div>
			</body>
		</html>
	);
}
