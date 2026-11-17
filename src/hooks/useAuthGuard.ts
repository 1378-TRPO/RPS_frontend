import { authService } from '@/services/authService';

export function useAuthGuard() {
    return {
        isAuthenticated: authService.isAuthenticated(),
    };
}
