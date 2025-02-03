"use client";

import { useRouter } from "next/navigation";
import {ReactNode, useEffect} from "react";

export default function RequireAccessToken({
                                               redirectPath = "/authenticate",
                                               children,
                                           }: {
    children: ReactNode;
    redirectPath: string;
}) {
    const router = useRouter();
    const hasAccessToken = typeof window !== "undefined" && localStorage.getItem("accessToken") !== null;

    useEffect(() => {
        if (!hasAccessToken) {
            router.replace(redirectPath);
        }
    }, [hasAccessToken, router, redirectPath]);

    if (!hasAccessToken) {
        return null;
    }

    return <>{children}</>;
}
