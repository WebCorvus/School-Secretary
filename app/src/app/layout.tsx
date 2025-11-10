import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { AppSidebar } from '@/components/AppSidebar'
import SiteHeader from '@/components/SiteHeader'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'App da Secretaria Escolar',
    description: 'Interface para acesso da base de dados da escola.',
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.className} `}>
                <UserProvider>
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
                </UserProvider>
            </body>
        </html>
    )
}
