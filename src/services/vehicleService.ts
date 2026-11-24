import type { CreateVehicleRequest, Vehicle } from '@/types/vehicle';

import { api } from './api';

export const vehicleService = {
    async createVehicle(payload: CreateVehicleRequest): Promise<Vehicle> {
        const { data } = await api.post<Vehicle>('/users/me/vehicles', payload);
        return data;
    },
};
