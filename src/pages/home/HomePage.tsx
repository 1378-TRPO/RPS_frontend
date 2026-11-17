import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useMe } from '@/queries/useMe';
import { ROLE_LABELS } from '@/utils/roles';

import styles from './HomePage.module.css';

const roleHints = {
    client: 'Вы вошли как клиент. Дальше здесь появятся запись на сервис и гараж.',
    mechanic: 'Вы вошли как механик. Список задач на день появится в следующих спринтах.',
    manager: 'Вы вошли как менеджер. Экран загрузки и записей появится позже.',
} as const;

export function HomePage() {
    const { data: me, isLoading, isError } = useMe();

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
                        {me ? roleHints[me.role] : 'Загружаем данные учетной записи...'}
                    </Text>
                </div>

                <Group gap="sm">
                    {!isLoading && me ? (
                        <Badge size="lg" variant="light" color="mist" radius="md">
                            Роль: {ROLE_LABELS[me.role]}
                        </Badge>
                    ) : null}
                    {isError ? (
                        <Badge size="lg" variant="light" color="red" radius="md">
                            Не удалось получить /auth/me
                        </Badge>
                    ) : null}
                    {me?.role === 'client' ? (
                        <Button
                            component={Link}
                            to="/profile"
                            rightSection={<IconArrowRight size={16} />}
                            radius="md"
                        >
                            Открыть профиль
                        </Button>
                    ) : null}
                </Group>

                {me ? (
                    <Text size="sm" c="dimmed">
                        Сессия по JWT. Актуальная роль берется из `/auth/me`, не только из токена.
                    </Text>
                ) : null}
            </Stack>
        </div>
    );
}
