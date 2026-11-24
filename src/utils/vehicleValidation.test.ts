import { describe, expect, it } from 'vitest';

import {
    currentMaxVehicleYear,
    toCreateVehiclePayload,
    validateVehicleMake,
    validateVehicleModel,
    validateVehiclePlate,
    validateVehicleYear,
} from '@/utils/vehicleValidation';

describe('vehicleValidation', () => {
    it('requires make, model and plate after trim', () => {
        expect(validateVehicleMake('   ')).toBe('Укажите марку');
        expect(validateVehicleModel('')).toBe('Укажите модель');
        expect(validateVehiclePlate('  ')).toBe('Укажите госномер');
        expect(validateVehicleMake('Toyota')).toBeNull();
        expect(validateVehicleModel('Camry')).toBeNull();
        expect(validateVehiclePlate('A123BC77')).toBeNull();
    });

    it('uses a proper label for length errors', () => {
        expect(validateVehicleMake('x'.repeat(101))).toBe('Марка: до 100 символов');
        expect(validateVehicleModel('x'.repeat(101))).toBe('Модель: до 100 символов');
        expect(validateVehiclePlate('x'.repeat(33))).toBe('Госномер: до 32 символов');
    });

    it('accepts integer years in range', () => {
        const now = new Date('2026-11-24T00:00:00Z');
        expect(validateVehicleYear('1900', now)).toBeNull();
        expect(validateVehicleYear('2027', now)).toBeNull();
        expect(validateVehicleYear('1899', now)).not.toBeNull();
        expect(validateVehicleYear('2028', now)).not.toBeNull();
        expect(validateVehicleYear('2026.5', now)).not.toBeNull();
        expect(validateVehicleYear('abc', now)).not.toBeNull();
    });

    it('builds create payload with trimmed fields', () => {
        expect(
            toCreateVehiclePayload({
                make: '  Toyota  ',
                model: ' Camry ',
                year: ' 2018 ',
                plate: ' A123BC77 ',
            }),
        ).toEqual({
            make: 'Toyota',
            model: 'Camry',
            year: 2018,
            plate: 'A123BC77',
        });
    });

    it('uses next calendar year as upper bound', () => {
        expect(currentMaxVehicleYear(new Date('2026-01-01'))).toBe(2027);
    });
});
