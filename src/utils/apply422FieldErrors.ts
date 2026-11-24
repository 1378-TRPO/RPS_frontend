import axios from 'axios';

export function apply422FieldErrors(
    err: unknown,
    fields: readonly string[],
    setFieldError: (field: string, message: string) => void,
): boolean {
    if (!axios.isAxiosError(err) || err.response?.status !== 422) {
        return false;
    }

    const detail = err.response.data?.detail;
    if (!Array.isArray(detail)) {
        return false;
    }

    const allowed = new Set(fields);
    let applied = false;

    for (const item of detail) {
        if (!item || typeof item !== 'object') continue;
        const loc = 'loc' in item ? item.loc : undefined;
        const msg = 'msg' in item ? item.msg : undefined;
        if (!Array.isArray(loc) || typeof msg !== 'string') continue;

        const field = loc[loc.length - 1];
        if (typeof field === 'string' && allowed.has(field)) {
            setFieldError(field, msg);
            applied = true;
        }
    }

    return applied;
}
