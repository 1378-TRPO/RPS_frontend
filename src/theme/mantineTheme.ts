import { createTheme, type MantineColorsTuple } from '@mantine/core';

import { PasswordVisibilityIcon } from '@/components/PasswordVisibilityIcon';

/** Пастельный dusty-teal, зеркало --rps-primary* */
const mist: MantineColorsTuple = [
    '#f3f7f9',
    '#e4eef3',
    '#c5d9e4',
    '#a3c2d3',
    '#8fb0c4',
    '#7a9eb5',
    '#6a8ea5',
    '#5a7f96',
    '#4a6b80',
    '#2f4a5a',
];

/** Мягкий clay/sand акцент */
const clay: MantineColorsTuple = [
    '#faf6f2',
    '#f3ebe3',
    '#e6d5c4',
    '#d8bfaa',
    '#ccb09b',
    '#c4a992',
    '#b39780',
    '#9a7e68',
    '#7d6552',
    '#5c4636',
];

export const mantineTheme = createTheme({
    primaryColor: 'mist',
    colors: {
        mist,
        clay,
    },
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    fontFamilyMonospace: "ui-monospace, 'Cascadia Code', Consolas, monospace",
    headings: {
        fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
        fontWeight: '600',
        sizes: {
            h1: { fontSize: '2.25rem', lineHeight: '1.2' },
            h2: { fontSize: '1.75rem', lineHeight: '1.25' },
            h3: { fontSize: '1.35rem', lineHeight: '1.3' },
        },
    },
    defaultRadius: 'md',
    radius: {
        xs: '6px',
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    shadows: {
        xs: '0 1px 2px rgba(36, 48, 64, 0.04)',
        sm: 'var(--rps-shadow-sm)',
        md: 'var(--rps-shadow-md)',
        lg: '0 8px 24px rgba(36, 48, 64, 0.1)',
        xl: '0 16px 48px rgba(36, 48, 64, 0.14)',
    },
    cursorType: 'pointer',
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        TextInput: {
            defaultProps: {
                radius: 'md',
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: 'md',
                visibilityToggleIcon: PasswordVisibilityIcon,
                rightSectionWidth: 36,
            },
            vars: () => ({
                root: {
                    '--psi-icon-size': '16px',
                    '--psi-button-size': '28px',
                },
            }),
        },
        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
            },
        },
    },
});
