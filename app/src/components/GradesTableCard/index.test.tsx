import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
    createFakeStudentSubjectGrades,
    type StudentSubjectGradesProps,
} from '@/types/student'
import { GradesTableCard } from './index'

const mockData: StudentSubjectGradesProps[] = [
    createFakeStudentSubjectGrades(),
    createFakeStudentSubjectGrades(),
    createFakeStudentSubjectGrades(),
]

describe('GradesTableCard', () => {
    it('deve renderizar o título e a descrição do card', () => {
        render(<GradesTableCard data={mockData} />)
        expect(screen.getByText('Boletim Escolar')).toBeInTheDocument()
        expect(
            screen.getByText('Notas por matéria e média anual'),
        ).toBeInTheDocument()
    })

    it('deve renderizar os cabeçalhos da tabela', () => {
        render(<GradesTableCard data={mockData} />)
        expect(screen.getByText('Matéria')).toBeInTheDocument()
        expect(screen.getByText('1º Bim')).toBeInTheDocument()
        expect(screen.getByText('2º Bim')).toBeInTheDocument()
        expect(screen.getByText('3º Bim')).toBeInTheDocument()
        expect(screen.getByText('4º Bim')).toBeInTheDocument()
        expect(screen.getByText('Média')).toBeInTheDocument()
    })

    it('deve renderizar os dados da tabela corretamente', () => {
        render(<GradesTableCard data={mockData} />)

        // Check subjects
        mockData.forEach((subject) => {
            expect(screen.getByText(subject.subject)).toBeInTheDocument()
        })
    })

    it('deve lidar com notas ausentes', () => {
        const dataWithMissingGrades: StudentSubjectGradesProps[] = [
            {
                subject: 'Art',
                grades: [10, null, 9, 8],
            },
        ]
        render(<GradesTableCard data={dataWithMissingGrades} />)

        expect(screen.getByText('Art')).toBeInTheDocument()
        expect(screen.getByText('-')).toBeInTheDocument()
    })
})
