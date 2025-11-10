import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { UserProvider } from '@/contexts/UserContext'
import AuthLayout from './AuthLayout'

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
                            <AuthLayout>{children}</AuthLayout>
                        </SidebarProvider>
                    </ThemeProvider>
                </UserProvider>
            </body>
        </html>
    )
}
