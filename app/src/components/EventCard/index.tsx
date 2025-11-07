import { Calendar, Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { EventProps } from '@/types/event'

interface EventCardProps {
    event: EventProps
    onClick?: (event: EventProps) => void
}

export function EventCard({ event, onClick }: EventCardProps) {
    return (
        <Card className="w-full max-w-md shadow-md rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    {event.title}
                </CardTitle>
                {event.start_date && (
                    <Badge variant="secondary" className="w-fit mt-2">
                        {event.start_date}
                        {event.end_date ? ` — ${event.end_date}` : ''}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-2">
                {event.start_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.start_date}
                        {event.end_date && ` - ${event.end_date}`}
                    </div>
                )}

                {(event.start_time || event.end_time) && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.start_time}
                        {event.end_time && ` - ${event.end_time}`}
                    </div>
                )}

                {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                    </div>
                )}

                {event.description && (
                    <p className="text-sm mt-2 text-foreground/80">
                        {event.description}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <button
                    type="button"
                    onClick={() => onClick?.(event)}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                    Ver detalhes
                </button>
            </CardFooter>
        </Card>
    )
}
