export type ServiceFormValues = {
    name: string;
    description: string;
    price: string;
    duration_minutes: string;
};

export const SERVICE_NAME_MAX_LENGTH = 200;
export const SERVICE_DESCRIPTION_MAX_LENGTH = 2000;

export function validateServiceName(value: string): string | null {
    const name = value.trim();
    if (!name) return 'Укажите название';
    if (name.length > SERVICE_NAME_MAX_LENGTH) {
        return `Название: до ${SERVICE_NAME_MAX_LENGTH} символов`;
    }
    return null;
}

export function validateServiceDescription(value: string): string | null {
    const description = value.trim();
    if (!description) return 'Укажите описание';
    if (description.length > SERVICE_DESCRIPTION_MAX_LENGTH) {
        return `Описание: до ${SERVICE_DESCRIPTION_MAX_LENGTH} символов`;
    }
    return null;
}

export function validateServicePrice(value: string): string | null {
    const price = value.trim().replace(',', '.');
    if (!price) return 'Укажите цену';
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        return 'Цена: число больше 0, до 2 знаков после запятой';
    }
    const amount = Number(price);
    if (!(amount > 0)) {
        return 'Цена должна быть больше 0';
    }
    return null;
}

export function validateServiceDuration(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Укажите длительность';
    if (!/^\d+$/.test(trimmed)) {
        return 'Длительность: целое число минут';
    }
    const minutes = Number(trimmed);
    if (!(minutes > 0)) {
        return 'Длительность должна быть больше 0';
    }
    return null;
}

export function toServiceWritePayload(values: ServiceFormValues) {
    return {
        name: values.name.trim(),
        description: values.description.trim(),
        price: values.price.trim().replace(',', '.'),
        duration_minutes: Number(values.duration_minutes.trim()),
    };
}
