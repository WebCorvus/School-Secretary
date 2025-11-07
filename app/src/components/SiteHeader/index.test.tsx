import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SiteHeader from './index'

vi.mock('@/components/ui/sidebar', () => ({
    SidebarTrigger: () => <button>Sidebar Trigger</button>,
}))

vi.mock('@/components/ThemeSwitcher', () => ({
    ThemeSwitcher: () => <button>Theme Switcher</button>,
}))

describe('SiteHeader', () => {
    it('deve renderizar o cabeçalho do site', () => {
        render(<SiteHeader />)

        expect(screen.getByText('Secretaria Escolar')).toBeInTheDocument()
        expect(screen.getByText('Sidebar Trigger')).toBeInTheDocument()
        expect(screen.getByText('Theme Switcher')).toBeInTheDocument()
    })
})
