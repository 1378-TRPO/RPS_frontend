const ACCESS_TOKEN_KEY = 'rps-access-token';

export const tokenStorage = {
    getAccessToken(): string | null {
        try {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        } catch {
            return null;
        }
    },

    setAccessToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};
