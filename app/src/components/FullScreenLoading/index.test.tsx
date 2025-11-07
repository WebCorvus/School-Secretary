import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FullScreenLoading } from './index'

describe('FullScreenLoading', () => {
    it('deve renderizar a mensagem "Carregando..."', () => {
        render(<FullScreenLoading />)
        expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })
})
