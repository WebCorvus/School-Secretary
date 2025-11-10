'use client'

import type React from 'react'
import { Header1 } from '@/components/Header1'
import { Paragraph } from '@/components/Paragraph'
import UserProfile from '@/components/user/UserProfile'

const ProfilePage: React.FC = () => {
    return (
        <div className="space-y-6">
            <Header1 text="User Profile" />
            <Paragraph
                text="View and manage your profile information"
                className="text-lg text-muted-foreground"
            />
            <div className="flex justify-center">
                <UserProfile />
            </div>
        </div>
    )
}

export default ProfilePage
