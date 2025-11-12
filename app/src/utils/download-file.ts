import { toast } from 'sonner'
import api from '@/services/api'

export async function openPdfInline(
    url: string,
    filename: string = 'document.pdf',
) {
    try {
        const response = await api.get(url, { responseType: 'blob' })
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(blob)

        // Open in a new tab
        const newWindow = window.open(fileURL, '_blank')
        if (newWindow) {
            newWindow.focus()
        } else {
            // Fallback for pop-up blockers: trigger a download
            const link = document.createElement('a')
            link.href = fileURL
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.info(
                'O PDF foi baixado, pois o bloqueador de pop-ups impediu a abertura em uma nova aba.',
            )
        }

        URL.revokeObjectURL(fileURL)
    } catch (error) {
        toast.error('Não foi possível abrir o PDF. Tente novamente mais tarde.')
        console.error('Error opening PDF inline:', error)
    }
}
