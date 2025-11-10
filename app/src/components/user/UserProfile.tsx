'use client'

import type React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/contexts/UserContext'

const UserProfile: React.FC = () => {
    const { user, loading, error } = useUser()

    if (loading) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-red-500">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!user) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>No User Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>User information is not available.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-800">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{user.email}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p>{user.role}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Status
                    </h3>
                    <p
                        className={
                            user.is_active ? 'text-green-600' : 'text-red-600'
                        }
                    >
                        {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                </div>
                {user.profile_details && (
                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium mb-2">
                            Profile Details
                        </h3>
                        <div className="text-sm text-gray-600">
                            <p>
                                Additional profile information would be
                                displayed here.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default UserProfile
