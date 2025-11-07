import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NavSecondary } from './index'

const mockItems = [
    {
        title: 'Group 1',
        url: '',
        items: [
            { title: 'Item 1.1', url: '/item1-1' },
            { title: 'Item 1.2', url: '/item1-2' },
        ],
    },
    {
        title: 'Group 2',
        url: '',
        items: [
            { title: 'Item 2.1', url: '/item2-1' },
            { title: 'Item 2.2', url: '/item2-2' },
        ],
    },
]

import { SidebarProvider } from '@/components/ui/sidebar'

describe('NavSecondary', () => {
    it('deve renderizar os grupos e itens de navegação', () => {
        render(
            <SidebarProvider>
                <NavSecondary items={mockItems} />
            </SidebarProvider>,
        )

        // Check group labels
        expect(screen.getByText('Group 1')).toBeInTheDocument()
        expect(screen.getByText('Group 2')).toBeInTheDocument()

        // Check links
        const item11Link = screen.getByRole('link', { name: 'Item 1.1' })
        expect(item11Link).toBeInTheDocument()
        expect(item11Link).toHaveAttribute('href', '/item1-1')

        const item22Link = screen.getByRole('link', { name: 'Item 2.2' })
        expect(item22Link).toBeInTheDocument()
        expect(item22Link).toHaveAttribute('href', '/item2-2')
    })
})
