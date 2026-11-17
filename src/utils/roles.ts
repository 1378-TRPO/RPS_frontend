import type { UserRole } from '@/types/auth';

export const ROLE_LABELS: Record<UserRole, string> = {
    client: 'Клиент',
    mechanic: 'Механик',
    manager: 'Менеджер',
};

export const ALL_ROLES: UserRole[] = ['client', 'mechanic', 'manager'];

export function isUserRole(value: string): value is UserRole {
    return ALL_ROLES.includes(value as UserRole);
}
