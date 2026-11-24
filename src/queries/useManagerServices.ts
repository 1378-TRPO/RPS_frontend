import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/queries/keys';
import { catalogService } from '@/services/catalogService';

export function useManagerServices() {
    return useQuery({
        queryKey: queryKeys.managerServices,
        queryFn: () => catalogService.getManagerServices(),
        retry: false,
    });
}
