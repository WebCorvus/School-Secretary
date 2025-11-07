'use client'

import { FullScreenError } from '@/components/FullScreenError'
import { FullScreenLoading } from '@/components/FullScreenLoading'
import { Header1 } from '@/components/Header1'
import { Paragraph } from '@/components/Paragraph'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResources } from '@/hooks/useResource'
import { ResourceStatus, ResourceType } from '@/types/resources'

export default function ResourcesPage() {
    const {
        resources,
        loading: resourcesLoading,
        error: resourcesError,
    } = useResources()

    if (resourcesLoading) return <FullScreenLoading />
    if (resourcesError)
        return (
            <FullScreenError
                error={
                    resourcesError ||
                    'Erro ao carregar informações de recursos.'
                }
            />
        )

    return (
        <div className="space-y-6">
            <Header1 text="Recursos" />
            <Paragraph
                text="Recursos disponíveis na escola"
                className="text-lg text-muted-foreground"
            />

            {Object.values(ResourceType).map((type) => {
                const resourcesByType = resources.filter(
                    (resource) => resource.resource_type === type,
                )

                if (resourcesByType.length === 0) return null

                const sortedResources = [...resourcesByType].sort((a, b) => {
                    const statusPriority = {
                        [ResourceStatus.AVAILABLE]: 0,
                        [ResourceStatus.IN_USE]: 1,
                        [ResourceStatus.MAINTENANCE]: 2,
                        [ResourceStatus.UNAVAILABLE]: 3,
                    }

                    return statusPriority[a.status] - statusPriority[b.status]
                })

                return (
                    <Card key={type}>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {getResourceTypeDisplay(type)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sortedResources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="p-4 border rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {resource.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {resource.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge
                                                    variant={getResourceStatusVariant(
                                                        resource.status,
                                                    )}
                                                >
                                                    {getResourceStatusDisplay(
                                                        resource.status,
                                                    )}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {getResourceTypeDisplay(
                                                        resource.resource_type,
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Criado em:{' '}
                                            {new Date(
                                                resource.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {resources.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            Nenhum recurso encontrado.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// Funções auxiliares para exibir os status e tipos
function getResourceStatusDisplay(status: ResourceStatus): string {
    switch (status) {
        case ResourceStatus.AVAILABLE:
            return 'Disponível'
        case ResourceStatus.IN_USE:
            return 'Em uso'
        case ResourceStatus.MAINTENANCE:
            return 'Manutenção'
        case ResourceStatus.UNAVAILABLE:
            return 'Indisponível'
        default:
            return status
    }
}

function getResourceStatusVariant(status: ResourceStatus) {
    switch (status) {
        case ResourceStatus.AVAILABLE:
            return 'default'
        case ResourceStatus.IN_USE:
            return 'destructive'
        case ResourceStatus.MAINTENANCE:
            return 'secondary'
        case ResourceStatus.UNAVAILABLE:
            return 'outline'
        default:
            return 'default'
    }
}

function getResourceTypeDisplay(type: ResourceType): string {
    switch (type) {
        case ResourceType.COMPUTER:
            return 'Computador'
        case ResourceType.BOOK:
            return 'Livro'
        case ResourceType.EQUIPMENT:
            return 'Equipamento'
        case ResourceType.OTHER:
            return 'Outro'
        default:
            return type
    }
}
