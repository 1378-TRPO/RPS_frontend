import { AppShell as MantineAppShell, Badge, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCarGarage } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

import { useMe } from '@/queries/useMe';
import { ROLE_LABELS } from '@/utils/roles';

import { AppNav } from './AppNav';
import styles from './AppShell.module.css';

export function AppShell() {
    const [opened, { toggle }] = useDisclosure();
    const { data: me } = useMe();

    return (
        <MantineAppShell
            header={{ height: 64 }}
            navbar={{
                width: 260,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            className={styles.shell}
        >
            <MantineAppShell.Header className={styles.header}>
                <Group h="100%" px="md" justify="space-between">
                    <Group gap="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group gap={8}>
                            <IconCarGarage size={22} stroke={1.6} />
                            <Text fw={700} className={styles.brand}>
                                RPS
                            </Text>
                        </Group>
                    </Group>

                    {me ? (
                        <Group gap="sm" visibleFrom="xs">
                            <Text size="sm" c="dimmed" lineClamp={1} maw={220}>
                                {me.email}
                            </Text>
                            <Badge variant="light" color="mist" radius="md">
                                {ROLE_LABELS[me.role]}
                            </Badge>
                        </Group>
                    ) : null}
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Navbar p="md" className={styles.navbar}>
                <AppNav onNavigate={() => opened && toggle()} />
            </MantineAppShell.Navbar>

            <MantineAppShell.Main>
                <Outlet />
            </MantineAppShell.Main>
        </MantineAppShell>
    );
}
