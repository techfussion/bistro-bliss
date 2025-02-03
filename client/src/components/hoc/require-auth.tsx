"use client"

import {ReactNode, useContext, useEffect} from "react";
import {useRouter} from "next/navigation";
import {AuthContext} from "@/contexts/auth.context";

export default function RequireAuth({children, redirectPath = "/admin/login", next}: {
    children: ReactNode,
    redirectPath: string,
    next: string
}) {
    const router = useRouter();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        console.log(user)
        if (!user) {
            router.replace(redirectPath + `${next ? "?next=" + next : ''}`);
        }
    }, [user, router, redirectPath]);

    if (!user) {
        return null;
    }

    return <>{children}</>
}