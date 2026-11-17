import { describe, expect, it } from 'vitest';

import {
    buildProfileUpdatePayload,
    hasNormalizedProfileChanges,
    normalizeProfileEmail,
    normalizeProfileName,
    normalizeProfilePhone,
    toFormValues,
    validateProfilePhone,
} from '@/utils/profileValidation';

describe('validateProfilePhone', () => {
    it('accepts 7 digits after + (lower bound)', () => {
        expect(validateProfilePhone('+7123456')).toBeNull();
    });

    it('accepts 15 digits after + (upper bound)', () => {
        expect(validateProfilePhone('+712345678901234')).toBeNull();
    });

    it('rejects fewer than 7 digits after +', () => {
        expect(validateProfilePhone('+712345')).not.toBeNull();
    });

    it('rejects more than 15 digits after +', () => {
        expect(validateProfilePhone('+7123456789012345')).not.toBeNull();
    });

    it('rejects leading 0 after +', () => {
        expect(validateProfilePhone('+07001234567')).not.toBeNull();
    });

    it('rejects brackets and spaces', () => {
        expect(validateProfilePhone('+7 (999) 123-45-67')).not.toBeNull();
        expect(validateProfilePhone('+7 999 1234567')).not.toBeNull();
    });

    it('allows empty phone', () => {
        expect(validateProfilePhone('')).toBeNull();
        expect(validateProfilePhone('   ')).toBeNull();
    });
});

describe('normalize helpers', () => {
    it('trims name and maps empty to null', () => {
        expect(normalizeProfileName('  Иван  ')).toBe('Иван');
        expect(normalizeProfileName('   ')).toBeNull();
    });

    it('trims phone and maps empty to null', () => {
        expect(normalizeProfilePhone('  +79991234567  ')).toBe('+79991234567');
        expect(normalizeProfilePhone('')).toBeNull();
    });

    it('lowercases and trims email', () => {
        expect(normalizeProfileEmail('  Client@Example.COM  ')).toBe('client@example.com');
    });

    it('maps null profile fields to empty strings for the form', () => {
        expect(
            toFormValues({
                name: null,
                phone: null,
                email: 'a@b.co',
            }),
        ).toEqual({ name: '', phone: '', email: 'a@b.co' });
    });
});

describe('normalized dirty / payload', () => {
    const initial = { name: 'Иван', phone: '+79991234567', email: 'client@example.com' };

    it('ignores trailing spaces and email case for dirty check', () => {
        expect(
            hasNormalizedProfileChanges(
                { name: 'Иван ', phone: '+79991234567', email: 'Client@Example.COM' },
                initial,
            ),
        ).toBe(false);
    });

    it('detects a real name change', () => {
        expect(hasNormalizedProfileChanges({ ...initial, name: 'Петр' }, initial)).toBe(true);
    });

    it('builds payload only for changed fields and sends null for cleared name/phone', () => {
        expect(
            buildProfileUpdatePayload(
                { name: '  ', phone: '+7123456789', email: 'NEW@example.com' },
                initial,
            ),
        ).toEqual({
            name: null,
            phone: '+7123456789',
            email: 'new@example.com',
        });
    });

    it('returns empty payload when only formatting differs', () => {
        expect(
            buildProfileUpdatePayload(
                { name: 'Иван ', phone: ' +79991234567 ', email: 'CLIENT@EXAMPLE.COM' },
                initial,
            ),
        ).toEqual({});
    });
});
