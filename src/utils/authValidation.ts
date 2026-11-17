export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const EMAIL_MAX_LENGTH = 254;

/** Как на API: внешние пробелы убираем, регистр нижний. */
export function normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
}

export function validateEmail(value: string): string | null {
    const email = normalizeEmail(value);
    if (!email) {
        return 'Введите email';
    }
    if (email.length > EMAIL_MAX_LENGTH) {
        return `Email не длиннее ${EMAIL_MAX_LENGTH} символов`;
    }
    // Простая проверка формата; финальная валидация на сервере
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Введите корректный email';
    }
    return null;
}

/** Пароль не обрезаем: пробелы внутри сохраняются, как на API. */
export function validatePassword(value: string): string | null {
    if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
        return `Пароль: ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} символов`;
    }
    return null;
}
