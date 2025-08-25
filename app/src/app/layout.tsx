import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import HorizontalLine from "@/components/HorizontalLine";
import Footer from "@/components/Footer";

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
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Header />
				<HorizontalLine />
				<div>{children}</div>
				<Footer />
			</body>
		</html>
	);
}
