import { Navigate, Outlet } from 'react-router-dom';

import { authService } from '@/services/authService';

export function PublicOnlyRoute() {
    if (authService.isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
