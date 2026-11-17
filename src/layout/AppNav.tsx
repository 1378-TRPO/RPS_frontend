import { NavLink as MantineNavLink, Stack } from '@mantine/core';
import { IconHome, IconLogout, IconUser } from '@tabler/icons-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { queryClient } from '@/queries/queryClient';
import { authService } from '@/services/authService';

type AppNavProps = {
    onNavigate?: () => void;
};

export function AppNav({ onNavigate }: AppNavProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        queryClient.clear();
        navigate('/login', { replace: true });
    };

    return (
        <Stack gap="xs">
            <MantineNavLink
                component={NavLink}
                to="/"
                label="Главная"
                leftSection={<IconHome size={18} stroke={1.6} />}
                onClick={onNavigate}
            />
            <MantineNavLink
                component={NavLink}
                to="/profile"
                label="Профиль"
                leftSection={<IconUser size={18} stroke={1.6} />}
                onClick={onNavigate}
            />
            <MantineNavLink
                label="Выйти"
                leftSection={<IconLogout size={18} stroke={1.6} />}
                onClick={() => {
                    onNavigate?.();
                    handleLogout();
                }}
                color="red"
            />
        </Stack>
    );
}
