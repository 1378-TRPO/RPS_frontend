export type VehicleFormValues = {
    make: string;
    model: string;
    year: string;
    plate: string;
};

export const MAKE_MAX_LENGTH = 100;
export const MODEL_MAX_LENGTH = 100;
export const PLATE_MAX_LENGTH = 32;
export const YEAR_MIN = 1900;

export function currentMaxVehicleYear(now = new Date()): number {
    return now.getFullYear() + 1;
}

export function validateRequiredText(
    value: string,
    label: string,
    maxLength: number,
): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return `Укажите ${label}`;
    }
    if (trimmed.length > maxLength) {
        return `${label}: до ${maxLength} символов`;
    }
    return null;
}

export function validateVehicleMake(value: string): string | null {
    return validateRequiredText(value, 'марку', MAKE_MAX_LENGTH);
}

export function validateVehicleModel(value: string): string | null {
    return validateRequiredText(value, 'модель', MODEL_MAX_LENGTH);
}

export function validateVehiclePlate(value: string): string | null {
    return validateRequiredText(value, 'госномер', PLATE_MAX_LENGTH);
}

export function validateVehicleYear(value: string, now = new Date()): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return 'Укажите год';
    }
    if (!/^-?\d+$/.test(trimmed)) {
        return 'Год должен быть целым числом';
    }
    const year = Number(trimmed);
    const maxYear = currentMaxVehicleYear(now);
    if (year < YEAR_MIN || year > maxYear) {
        return `Год: ${YEAR_MIN}-${maxYear}`;
    }
    return null;
}

export function normalizeVehicleText(value: string): string {
    return value.trim();
}

export function normalizeVehicleYear(value: string): number {
    return Number(value.trim());
}

export function toCreateVehiclePayload(values: VehicleFormValues) {
    return {
        make: normalizeVehicleText(values.make),
        model: normalizeVehicleText(values.model),
        year: normalizeVehicleYear(values.year),
        plate: normalizeVehicleText(values.plate),
    };
}
