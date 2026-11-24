import { describe, expect, it } from 'vitest';

import { formatServiceDuration, formatServicePrice } from '@/utils/serviceFormat';

describe('formatServicePrice', () => {
    it('formats number and decimal string as RUB', () => {
        expect(formatServicePrice(1500)).toMatch(/1[\u00a0\s]?500,00/);
        expect(formatServicePrice('199.5')).toMatch(/199,50/);
        expect(formatServicePrice('99.99')).toMatch(/99,99/);
    });

    it('falls back for non-numeric values', () => {
        expect(formatServicePrice('n/a')).toBe('n/a');
    });
});

describe('formatServiceDuration', () => {
    it('formats minutes only', () => {
        expect(formatServiceDuration(45)).toBe('45 мин');
    });

    it('formats whole hours', () => {
        expect(formatServiceDuration(60)).toBe('1 ч');
        expect(formatServiceDuration(120)).toBe('2 ч');
    });

    it('formats hours with remaining minutes', () => {
        expect(formatServiceDuration(90)).toBe('1 ч 30 мин');
        expect(formatServiceDuration(125)).toBe('2 ч 5 мин');
    });
});
