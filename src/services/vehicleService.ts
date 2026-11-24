import type { CreateVehicleRequest, Vehicle } from '@/types/vehicle';

import { api } from './api';

export const vehicleService = {
    async getVehicles(): Promise<Vehicle[]> {
        const { data } = await api.get<Vehicle[]>('/users/me/vehicles');
        return data;
    },

    async createVehicle(payload: CreateVehicleRequest): Promise<Vehicle> {
        const { data } = await api.post<Vehicle>('/users/me/vehicles', payload);
        return data;
    },
};
