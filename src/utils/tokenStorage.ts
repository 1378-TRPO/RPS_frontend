const ACCESS_TOKEN_KEY = 'rps-access-token';
const ACCESS_EXPIRES_AT_KEY = 'rps-access-expires-at';

/** Запас на рассинхрон часов, мс */
const EXPIRY_SKEW_MS = 5_000;

type JwtClaims = {
    exp?: number;
    role?: string;
    sub?: string;
};

function parseJwtPayload(token: string): JwtClaims | null {
    try {
        const part = token.split('.')[1];
        if (!part) return null;
        const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(
            normalized.length + ((4 - (normalized.length % 4)) % 4),
            '=',
        );
        return JSON.parse(atob(padded)) as JwtClaims;
    } catch {
        return null;
    }
}

export const tokenStorage = {
    getAccessToken(): string | null {
        try {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        } catch {
            return null;
        }
    },

    getExpiresAt(): number | null {
        try {
            const raw = localStorage.getItem(ACCESS_EXPIRES_AT_KEY);
            if (!raw) return null;
            const value = Number(raw);
            return Number.isFinite(value) ? value : null;
        } catch {
            return null;
        }
    },

    setSession(token: string, expiresInSeconds: number): void {
        const fromTtl = Date.now() + expiresInSeconds * 1000;
        const claims = parseJwtPayload(token);
        const fromJwt = claims?.exp ? claims.exp * 1000 : fromTtl;
        const expiresAt = Math.min(fromTtl, fromJwt);

        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(ACCESS_EXPIRES_AT_KEY, String(expiresAt));
    },

    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(ACCESS_EXPIRES_AT_KEY);
    },

    isAccessValid(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;

        const expiresAt = this.getExpiresAt();
        if (expiresAt !== null) {
            return expiresAt > Date.now() + EXPIRY_SKEW_MS;
        }

        const claims = parseJwtPayload(token);
        if (!claims?.exp) return true;
        return claims.exp * 1000 > Date.now() + EXPIRY_SKEW_MS;
    },

    /** Снимок роли из JWT (актуальная роль все равно берется из /auth/me). */
    getTokenRole(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;
        return parseJwtPayload(token)?.role ?? null;
    },
};
