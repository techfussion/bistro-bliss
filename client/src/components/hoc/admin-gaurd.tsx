'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import { useToast } from "@/hooks/use-toast";


interface AuthContextType {
    isLoggedIn: boolean;
    user?: {
        role: string;
    };
}

interface ProtectedAdminProps {
    auth: AuthContextType;
}

export function AdminGuard<P>(Component: ComponentType<P>) {
    return function ProtectedAdmin(props: P & ProtectedAdminProps) {
        const { toast } = useToast();
        const { auth } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!auth.isLoggedIn || auth.user?.role !== "ADMIN") {
                toast({
                    title: 'Access Denied',
                    variant: 'destructive',
                    description: 'You do not have permission to view this page.',
                });
                router.replace("/login");
            }
        }, [auth, router]);

        return auth.isLoggedIn && auth.user?.role === "ADMIN" ? (
            <Component {...props} />
        ) : null;
    };
}
