import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SidebarProvider } from '@/components/ui/sidebar'

import SiteHeader from './index'

vi.mock('@/components/ui/sidebar', async () => {
    const actual = await vi.importActual('@/components/ui/sidebar')
    return {
        ...actual,
        SidebarTrigger: () => <button type="button">Sidebar Trigger</button>,
    }
})

vi.mock('@/components/ThemeSwitcher', () => ({
    ThemeSwitcher: () => <button type="button">Theme Switcher</button>,
}))

describe('SiteHeader', () => {
    it('deve renderizar o cabeçalho do site', () => {
        render(
            <SidebarProvider>
                <SiteHeader />
            </SidebarProvider>,
        )

        expect(screen.getByText('Secretaria Escolar')).toBeInTheDocument()
        expect(screen.getByText('Sidebar Trigger')).toBeInTheDocument()
        expect(screen.getByText('Theme Switcher')).toBeInTheDocument()
    })
})
