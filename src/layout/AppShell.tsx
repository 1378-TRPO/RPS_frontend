import { AppShell as MantineAppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCarGarage } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

import { AppNav } from './AppNav';
import styles from './AppShell.module.css';

export function AppShell() {
    const [opened, { toggle }] = useDisclosure();

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
