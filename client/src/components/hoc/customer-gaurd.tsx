import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    isLoggedIn: boolean;
    user?: {
        role: string;
    };
}

interface ProtectedCustomerProps {
    auth: AuthContextType;
}


export function CustomerGuard<P>(Component: ComponentType<P>) {
    return function ProtectedCustomer(props: P & ProtectedCustomerProps) {
        const { toast } = useToast();
        const { auth } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!auth.isLoggedIn || auth.user?.role !== "CUSTOMER") {
                router.replace("/login");
                toast({
                    variant: "destructive",
                    description: "You need to be signed in.",
                })
            }
        }, [auth, router]);

        return auth.isLoggedIn && auth.user?.role === "CUSTOMER" ? (
            <Component {...props} />
        ) : null;
    };
}
  