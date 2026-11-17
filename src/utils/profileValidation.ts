import { normalizeEmail, validateEmail } from '@/utils/authValidation';

export const NAME_MAX_LENGTH = 100;
/** Как на API: + и 7-15 цифр, первая не 0 */
export const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;

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
