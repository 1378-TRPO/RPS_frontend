export type UserRole = 'client' | 'mechanic' | 'manager';

export type AuthUser = {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
};

export type ClientProfile = {
    id: string;
    name: string | null;
    phone: string | null;
    email: string;
};

export type LoginResponse = {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
};

export type RegisterResponse = AuthUser;
