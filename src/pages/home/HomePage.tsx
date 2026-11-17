import { Badge, Button, Group, Stack, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useMe } from '@/queries/useMe';
import { ROLE_LABELS } from '@/utils/roles';

import styles from './HomePage.module.css';

export function HomePage() {
    const { data: me, isLoading, isError } = useMe();

    return (
        <div className={styles.page}>
            <Stack gap="lg" maw={720}>
                <Title order={1} className={styles.title}>
                    {me?.email ? me.email.split('@')[0] : 'RPS'}
                </Title>

                <Group gap="sm">
                    {!isLoading && me ? (
                        <Badge size="lg" variant="light" color="mist" radius="md">
                            {ROLE_LABELS[me.role]}
                        </Badge>
                    ) : null}
                    {isError ? (
                        <Badge size="lg" variant="light" color="red" radius="md">
                            Ошибка загрузки
                        </Badge>
                    ) : null}
                    {me?.role === 'client' ? (
                        <Button
                            component={Link}
                            to="/profile"
                            rightSection={<IconArrowRight size={16} />}
                            radius="md"
                        >
                            Профиль
                        </Button>
                    ) : null}
                </Group>
            </Stack>
        </div>
    );
}
