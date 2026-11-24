import type { Service } from '@/types/service';

import { api } from './api';

export const catalogService = {
    async getServices(): Promise<Service[]> {
        const { data } = await api.get<Service[]>('/services');
        return data;
    },
};
