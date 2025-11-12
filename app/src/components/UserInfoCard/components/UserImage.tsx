import { User } from 'lucide-react'
import Image from 'next/image'

interface UserImageProps {
    photoUrl?: string
    fullName?: string
    className?: string
}

export function UserImage({ photoUrl, fullName, className }: UserImageProps) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            {photoUrl ? (
                <Image
                    src={photoUrl}
                    alt={fullName || 'User photo'}
                    width={320}
                    height={320}
                    className="h-80 object-cover border-1 border-[var(--primary)] shadow-md"
                />
            ) : (
                <User className="h-80 w-80 rounded-full border-4 border-[var(--primary)] shadow-md p-4" />
            )}
        </div>
    )
}
