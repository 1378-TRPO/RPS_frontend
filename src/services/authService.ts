import type { AuthUser, ClientProfile, LoginResponse, RegisterResponse } from '@/types/auth';
import { tokenStorage } from '@/utils/tokenStorage';

import { api } from './api';

export type RegisterPayload = {
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type UpdateProfilePayload = {
    name?: string | null;
    phone?: string | null;
    email?: string;
};

export const authService = {
    isAuthenticated(): boolean {
        return tokenStorage.isAccessValid();
    },

    async register(payload: RegisterPayload): Promise<RegisterResponse> {
        const { data } = await api.post<RegisterResponse>('/auth/register', payload);
        return data;
    },

    async login(payload: LoginPayload): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login', payload);
        tokenStorage.setSession(data.access_token, data.expires_in);
        return data;
    },

    async me(): Promise<AuthUser> {
        const { data } = await api.get<AuthUser>('/auth/me');
        return data;
    },

    async getProfile(): Promise<ClientProfile> {
        const { data } = await api.get<ClientProfile>('/users/me');
        return data;
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<ClientProfile> {
        const { data } = await api.patch<ClientProfile>('/users/me', payload);
        return data;
    },

    logout(): void {
        tokenStorage.clear();
    },
};
