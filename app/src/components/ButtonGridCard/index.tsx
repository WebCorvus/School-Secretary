'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'

import type { DocumentRequest } from '@/types/documentRequest'

interface ButtonGridCardProps {
    header: string
    description?: string
    data: DocumentRequest[]
    handleClick: (item: DocumentRequest) => void
    className?: string
}

export function ButtonGridCard({
    header,
    description,
    data,
    handleClick,
    className,
}: ButtonGridCardProps) {
    const { data: userInfo } = useUser()

    // Check if user is staff (which includes superuser in Django) to determine if confirmation dialog should be shown
    const shouldShowConfirmation = !userInfo?.is_staff

    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <CardTitle>{header}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                    {data.map((item) => (
                        <li key={item.id}>
                            {shouldShowConfirmation ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-blue-500 hover:bg-blue-100"
                                        >
                                            {item.title}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confirmar ação
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Você deseja realmente selecionar{' '}
                                                <strong>{item.title}</strong>?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleClick(item)
                                                }
                                            >
                                                Confirmar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full text-blue-500 hover:bg-blue-100"
                                    onClick={() => handleClick(item)}
                                >
                                    {item.title}
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
