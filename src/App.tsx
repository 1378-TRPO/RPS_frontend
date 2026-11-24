import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/layout/AppShell';
import { ClientOnlyRoute } from '@/layout/ClientOnlyRoute';
import { ProtectedRoute } from '@/layout/ProtectedRoute';
import { PublicOnlyRoute } from '@/layout/PublicOnlyRoute';
import { GaragePage } from '@/pages/garage/GaragePage';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { ServicesPage } from '@/pages/services/ServicesPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/useTheme';

function ThemedApp() {
    const { effectiveTheme } = useTheme();

    return (
        <MantineProvider theme={mantineTheme} forceColorScheme={effectiveTheme}>
            <Notifications position="top-right" />
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicOnlyRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppShell />}>
                            <Route path="/" element={<HomePage />} />
                            <Route element={<ClientOnlyRoute />}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/garage" element={<GaragePage />} />
                                <Route path="/services" element={<ServicesPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <ThemedApp />
        </ThemeProvider>
    );
}
