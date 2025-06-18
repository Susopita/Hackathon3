// src/components/ProtectedRoute.tsx
'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const authContext = useAuthContext();
    const router = useRouter();

    if (authContext.isLoading) {
        return null;
    }

    if (!authContext.session) {
        router.push('/auth/login');
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
