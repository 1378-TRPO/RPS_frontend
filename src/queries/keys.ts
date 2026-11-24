export const queryKeys = {
    me: ['auth', 'me'] as const,
    profile: ['users', 'me'] as const,
    vehicles: ['users', 'me', 'vehicles'] as const,
    services: ['services'] as const,
};
