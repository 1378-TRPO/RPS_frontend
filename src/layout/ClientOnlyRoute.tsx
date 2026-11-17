import { Alert, Center, Loader } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

import { useMe } from '@/queries/useMe';

export function ClientOnlyRoute() {
    const { data: me, isLoading, isError } = useMe();

    if (isLoading) {
        return (
            <Center p="xl">
                <Loader color="mist" />
            </Center>
        );
    }

    if (isError || !me) {
        return (
            <Center p="xl">
                <Alert
                    color="yellow"
                    variant="light"
                    icon={<IconAlertCircle size={16} />}
                    maw={480}
                >
                    Не удалось проверить доступ к профилю. Обновите страницу или войдите снова.
                </Alert>
            </Center>
        );
    }

    if (me.role !== 'client') {
        return (
            <Center p="xl">
                <Alert
                    color="yellow"
                    variant="light"
                    icon={<IconAlertCircle size={16} />}
                    maw={480}
                >
                    Профиль с именем и телефоном доступен только роли client. Для вашей роли
                    смотрите данные учетной записи на главной.
                </Alert>
            </Center>
        );
    }

    return <Outlet />;
}
