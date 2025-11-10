"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import SiteHeader from "@/components/SiteHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isClient, setIsClient] = useState(false);
    const [hasAccessToken, setHasAccessToken] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const accessToken = getCookie("access");
        setHasAccessToken(!!accessToken);
    }, []);

    if (isClient && !hasAccessToken) {
        return <main className="flex flex-1 flex-col">{children}</main>;
    }

    return (
        <>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
                <Toaster />
            </SidebarInset>
        </>
    );
}
