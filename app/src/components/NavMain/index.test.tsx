import { render, screen } from '@testing-library/react'
import { Bell, Home } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { NavMain } from './index'

const mockItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Notifications', url: '/notifications', icon: Bell },
]

import { SidebarProvider } from '@/components/ui/sidebar'

describe('NavMain', () => {
    it('deve renderizar os itens de navegação', () => {
        render(
            <SidebarProvider>
                <NavMain items={mockItems} />
            </SidebarProvider>,
        )

        const homeLink = screen.getByRole('link', { name: 'Home' })
        const notificationsLink = screen.getByRole('link', {
            name: 'Notifications',
        })

        expect(homeLink).toBeInTheDocument()
        expect(homeLink).toHaveAttribute('href', '/')

        expect(notificationsLink).toBeInTheDocument()
        expect(notificationsLink).toHaveAttribute('href', '/notifications')
    })
})
