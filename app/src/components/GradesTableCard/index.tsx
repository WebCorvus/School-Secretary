'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { StudentSubjectGradesProps } from '@/types/student'

export function GradesTableCard({
    data,
}: {
    data: StudentSubjectGradesProps[]
}) {
    const bimesters = ['1º Bim', '2º Bim', '3º Bim', '4º Bim']

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Boletim Escolar</CardTitle>
                <CardDescription>
                    Notas por matéria e média anual
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Matéria</TableHead>
                            {bimesters.map((bim) => (
                                <TableHead key={bim} className="text-center">
                                    {bim}
                                </TableHead>
                            ))}
                            <TableHead className="text-center">Média</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => {
                            const validGrades = item.grades.filter(
                                (note) => typeof note === 'number',
                            )
                            const average =
                                validGrades.reduce((acc, n) => acc + n, 0) /
                                (validGrades.length || 1)
                            return (
                                <TableRow key={item.subject}>
                                    <TableCell>{item.subject}</TableCell>
                                    {item.grades.map((note, idx) => (
                                        <TableCell
                                            key={`${item.subject}-${idx}`}
                                            className="text-center"
                                        >
                                            {typeof note === 'number'
                                                ? note.toFixed(1)
                                                : '-'}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                        {average.toFixed(1)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
