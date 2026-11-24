import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/queries/keys';
import { catalogService } from '@/services/catalogService';

export function useServices() {
    return useQuery({
        queryKey: queryKeys.services,
        queryFn: () => catalogService.getServices(),
        retry: false,
    });
}
