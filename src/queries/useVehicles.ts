import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/queries/keys';
import { vehicleService } from '@/services/vehicleService';

export function useVehicles() {
    return useQuery({
        queryKey: queryKeys.vehicles,
        queryFn: () => vehicleService.getVehicles(),
        retry: false,
    });
}
