import type { ClientProfile } from '@/types/auth';
import { EMAIL_MAX_LENGTH, normalizeEmail, validateEmail } from '@/utils/authValidation';

export { EMAIL_MAX_LENGTH };

export const NAME_MAX_LENGTH = 100;
/** Как на API: + и 7-15 цифр, первая не 0 */
export const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;
/** `+` и до 15 цифр */
export const PHONE_MAX_LENGTH = 16;

export type ProfileFormValues = {
    name: string;
    phone: string;
    email: string;
};

export type ProfileUpdatePayload = {
    name?: string | null;
    phone?: string | null;
    email?: string;
};

export function toFormValues(
    profile: Pick<ClientProfile, 'name' | 'phone' | 'email'>,
): ProfileFormValues {
    return {
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        email: profile.email,
    };
}

export function validateProfileName(value: string): string | null {
    const name = value.trim();
    if (!name) return null;
    if (name.length > NAME_MAX_LENGTH) {
        return `Имя до ${NAME_MAX_LENGTH} символов`;
    }
    return null;
}

export function validateProfilePhone(value: string): string | null {
    const phone = value.trim();
    if (!phone) return null;
    if (!PHONE_PATTERN.test(phone)) {
        return 'Формат: + и 7-15 цифр, например +79991234567';
    }
    return null;
}

export function validateProfileEmail(value: string): string | null {
    return validateEmail(value);
}

export function normalizeProfileName(value: string): string | null {
    const name = value.trim();
    return name || null;
}

export function normalizeProfilePhone(value: string): string | null {
    const phone = value.trim();
    return phone || null;
}

export function normalizeProfileEmail(value: string): string {
    return normalizeEmail(value);
}

export function hasNormalizedProfileChanges(
    current: ProfileFormValues,
    initial: ProfileFormValues,
): boolean {
    return (
        normalizeProfileName(current.name) !== normalizeProfileName(initial.name) ||
        normalizeProfilePhone(current.phone) !== normalizeProfilePhone(initial.phone) ||
        normalizeProfileEmail(current.email) !== normalizeProfileEmail(initial.email)
    );
}

export function buildProfileUpdatePayload(
    current: ProfileFormValues,
    initial: ProfileFormValues,
): ProfileUpdatePayload {
    const payload: ProfileUpdatePayload = {};
    const nextName = normalizeProfileName(current.name);
    const nextPhone = normalizeProfilePhone(current.phone);
    const nextEmail = normalizeProfileEmail(current.email);

    if (nextName !== normalizeProfileName(initial.name)) {
        payload.name = nextName;
    }
    if (nextPhone !== normalizeProfilePhone(initial.phone)) {
        payload.phone = nextPhone;
    }
    if (nextEmail !== normalizeProfileEmail(initial.email)) {
        payload.email = nextEmail;
    }

    return payload;
}
