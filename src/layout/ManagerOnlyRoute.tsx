import { Alert, Center, Loader } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';

import { useMe } from '@/queries/useMe';

export function ManagerOnlyRoute() {
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
                    Не удалось проверить доступ. Обновите страницу или войдите снова.
                </Alert>
            </Center>
        );
    }

    if (me.role !== 'manager') {
        return (
            <Center p="xl">
                <Alert
                    color="yellow"
                    variant="light"
                    icon={<IconAlertCircle size={16} />}
                    maw={480}
                >
                    Управление каталогом доступно только роли manager.
                </Alert>
            </Center>
        );
    }

    return <Outlet />;
}
