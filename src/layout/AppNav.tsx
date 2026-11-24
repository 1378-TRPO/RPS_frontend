import { NavLink as MantineNavLink, Stack, Text } from '@mantine/core';
import { IconCarGarage, IconHome, IconLogout, IconUser } from '@tabler/icons-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { queryClient } from '@/queries/queryClient';
import { useMe } from '@/queries/useMe';
import { authService } from '@/services/authService';
import { ROLE_LABELS } from '@/utils/roles';

type AppNavProps = {
    onNavigate?: () => void;
};

export function AppNav({ onNavigate }: AppNavProps) {
    const navigate = useNavigate();
    const { data: me } = useMe();
    const isClient = me?.role === 'client';

    const handleLogout = () => {
        authService.logout();
        queryClient.clear();
        navigate('/login', { replace: true });
    };

    return (
        <Stack gap="md" h="100%">
            <Stack gap="xs" style={{ flex: 1 }}>
                <MantineNavLink
                    component={NavLink}
                    to="/"
                    label="Главная"
                    leftSection={<IconHome size={18} stroke={1.6} />}
                    onClick={onNavigate}
                />
                {isClient ? (
                    <>
                        <MantineNavLink
                            component={NavLink}
                            to="/garage"
                            label="Гараж"
                            leftSection={<IconCarGarage size={18} stroke={1.6} />}
                            onClick={onNavigate}
                        />
                        <MantineNavLink
                            component={NavLink}
                            to="/profile"
                            label="Профиль"
                            leftSection={<IconUser size={18} stroke={1.6} />}
                            onClick={onNavigate}
                        />
                    </>
                ) : null}
            </Stack>

            {me ? (
                <Stack gap={4} hiddenFrom="xs">
                    <Text size="xs" c="dimmed" lineClamp={1}>
                        {me.email}
                    </Text>
                    <Text size="xs" fw={600}>
                        {ROLE_LABELS[me.role]}
                    </Text>
                </Stack>
            ) : null}

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
