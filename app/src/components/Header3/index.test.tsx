import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Header3 } from './index'

describe('Header3', () => {
    it('deve renderizar o texto do cabeçalho', () => {
        render(<Header3 text="Test Header" />)
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            'Test Header',
        )
    })
})
