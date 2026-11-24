import type { ManagerService, Service, ServiceWritePayload } from '@/types/service';

import { api } from './api';

export const catalogService = {
    async getServices(): Promise<Service[]> {
        const { data } = await api.get<Service[]>('/services');
        return data;
    },

    async getManagerServices(): Promise<ManagerService[]> {
        const { data } = await api.get<ManagerService[]>('/manager/services');
        return data;
    },

    async createService(payload: ServiceWritePayload): Promise<ManagerService> {
        const { data } = await api.post<ManagerService>('/manager/services', payload);
        return data;
    },

    async updateService(id: string, payload: ServiceWritePayload): Promise<ManagerService> {
        const { data } = await api.patch<ManagerService>(`/manager/services/${id}`, payload);
        return data;
    },

    async deactivateService(id: string): Promise<ManagerService | void> {
        const { data } = await api.delete<ManagerService | void>(`/manager/services/${id}`);
        return data;
    },
};
