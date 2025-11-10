'use client'

import { Download, FileText, GraduationCap } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

export default function StudentDetailPage() {
    const params = useParams()
    const studentId = params.id as string

    const handleDownloadBulletin = async () => {
        try {
            const response = await api.get(`/students/${studentId}/bulletin/`, {
                responseType: 'blob',
            })

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `boletim_${studentId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)

            toast.success('Boletim baixado com sucesso!')
        } catch (error) {
            console.error('Error downloading bulletin:', error)
            toast.error('Erro ao baixar o boletim. Verifique suas permissões.')
        }
    }

    const handleDownloadHistory = async () => {
        try {
            const response = await api.get(
                `/students/${studentId}/academic_history/`,
                {
                    responseType: 'blob',
                },
            )

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `historico_${studentId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)

            toast.success('Histórico escolar baixado com sucesso!')
        } catch (error) {
            console.error('Error downloading history:', error)
            toast.error(
                'Erro ao baixar o histórico. Verifique suas permissões.',
            )
        }
    }

    return (
        <div className="space-y-6">
            <div className="title-container">
                <h1 className="title">Detalhes do Aluno</h1>
                <p className="text-muted-foreground">
                    Informações detalhadas do aluno (ID: {studentId})
                </p>
            </div>

            {/* Report Download Section */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Relatórios Disponíveis
                </h2>
                <p className="text-muted-foreground mb-6">
                    Baixe os relatórios acadêmicos do aluno em formato PDF
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        onClick={handleDownloadBulletin}
                        className="w-full h-auto py-4 flex flex-col items-center gap-2"
                        variant="outline"
                    >
                        <Download className="h-6 w-6" />
                        <div className="text-center">
                            <div className="font-semibold">Baixar Boletim</div>
                            <div className="text-xs text-muted-foreground">
                                Notas e frequência
                            </div>
                        </div>
                    </Button>

                    <Button
                        onClick={handleDownloadHistory}
                        className="w-full h-auto py-4 flex flex-col items-center gap-2"
                        variant="outline"
                    >
                        <GraduationCap className="h-6 w-6" />
                        <div className="text-center">
                            <div className="font-semibold">
                                Baixar Histórico Escolar
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Completo com advertências
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}
