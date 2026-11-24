import { describe, expect, it } from 'vitest';

import {
    toServiceWritePayload,
    validateServiceDuration,
    validateServicePrice,
} from '@/utils/serviceValidation';

describe('serviceValidation', () => {
    it('accepts positive prices with up to 2 decimals', () => {
        expect(validateServicePrice('100')).toBeNull();
        expect(validateServicePrice('99.9')).toBeNull();
        expect(validateServicePrice('99,99')).toBeNull();
        expect(validateServicePrice('0')).not.toBeNull();
        expect(validateServicePrice('1.234')).not.toBeNull();
        expect(validateServicePrice('abc')).not.toBeNull();
    });

    it('accepts positive integer durations', () => {
        expect(validateServiceDuration('45')).toBeNull();
        expect(validateServiceDuration('0')).not.toBeNull();
        expect(validateServiceDuration('1.5')).not.toBeNull();
    });

    it('normalizes payload', () => {
        expect(
            toServiceWritePayload({
                name: '  Мойка  ',
                description: '  Кузов  ',
                price: '1500,5',
                duration_minutes: ' 60 ',
            }),
        ).toEqual({
            name: 'Мойка',
            description: 'Кузов',
            price: '1500.5',
            duration_minutes: 60,
        });
    });
});
