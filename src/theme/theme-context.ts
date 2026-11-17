import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export type ThemeContextValue = {
    mode: ThemeMode;
    effectiveTheme: EffectiveTheme;
    setMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
