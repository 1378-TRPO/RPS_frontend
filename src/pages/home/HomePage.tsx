import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useMe } from '@/queries/useMe';

import styles from './HomePage.module.css';

const roleLabels = {
    client: 'Клиент',
    mechanic: 'Механик',
    manager: 'Менеджер',
} as const;

export function HomePage() {
    const { data: me, isLoading } = useMe();

    return (
        <div className={styles.page}>
            <Stack gap="lg" maw={720}>
                <div>
                    <Text className={styles.eyebrow} mb={8}>
                        Личный кабинет
                    </Text>
                    <Title order={1} className={styles.title}>
                        Добро пожаловать
                        {me?.email ? `, ${me.email.split('@')[0]}` : ''}
                    </Title>
                    <Text c="dimmed" mt="sm" maw={520}>
                        Здесь будет рабочее пространство сервиса: заказы, статусы и профиль. Сейчас
                        доступны вход, регистрация и профиль клиента.
                    </Text>
                </div>

                <Group gap="sm">
                    {!isLoading && me ? (
                        <Badge size="lg" variant="light" color="mist" radius="md">
                            Роль: {roleLabels[me.role]}
                        </Badge>
                    ) : null}
                    <Button
                        component={Link}
                        to="/profile"
                        rightSection={<IconArrowRight size={16} />}
                        radius="md"
                    >
                        Открыть профиль
                    </Button>
                </Group>
            </Stack>
        </div>
    );
}
