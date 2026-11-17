import { useQuery } from '@tanstack/react-query';

import { authService } from '@/services/authService';

import { queryKeys } from './keys';

export function useMe(enabled = true) {
    return useQuery({
        queryKey: queryKeys.me,
        queryFn: () => authService.me(),
        enabled: enabled && authService.isAuthenticated(),
    });
}
