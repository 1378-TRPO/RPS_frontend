import { Alert, Button, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

import { useServices } from '@/queries/useServices';
import type { Service } from '@/types/service';
import { formatServiceDuration, formatServicePrice } from '@/utils/serviceFormat';

import styles from './ServicesPage.module.css';

function ServiceCard({ service }: { service: Service }) {
    return (
        <Paper className={styles.card} p="lg" radius="lg" shadow="sm">
            <Stack gap="sm" h="100%">
                <Title order={4}>{service.name}</Title>
                <Text className={styles.description} size="sm">
                    {service.description}
                </Text>
                <div className={styles.meta}>
                    <Text className={styles.metaItem}>{formatServicePrice(service.price)}</Text>
                    <Text c="dimmed" size="sm">
                        {formatServiceDuration(service.duration_minutes)}
                    </Text>
                </div>
            </Stack>
        </Paper>
    );
}

export function ServicesPage() {
    const servicesQuery = useServices();

    return (
        <div className={styles.page}>
            <Stack className={styles.layout} gap="lg">
                <Title order={2}>Услуги</Title>

                {servicesQuery.isLoading ? (
                    <Center py="xl">
                        <Loader color="mist" />
                    </Center>
                ) : null}

                {servicesQuery.isError ? (
                    <Stack gap="sm">
                        <Alert color="yellow" variant="light" icon={<IconAlertCircle size={16} />}>
                            Не удалось загрузить каталог услуг.
                        </Alert>
                        <Button
                            variant="light"
                            color="mist"
                            leftSection={<IconRefresh size={16} />}
                            onClick={() => {
                                void servicesQuery.refetch();
                            }}
                            w={{ base: '100%', xs: 'auto' }}
                        >
                            Повторить
                        </Button>
                    </Stack>
                ) : null}

                {!servicesQuery.isLoading &&
                !servicesQuery.isError &&
                (servicesQuery.data?.length ?? 0) === 0 ? (
                    <Text c="dimmed" size="sm">
                        Пока нет доступных услуг.
                    </Text>
                ) : null}

                {!servicesQuery.isLoading &&
                !servicesQuery.isError &&
                (servicesQuery.data?.length ?? 0) > 0 ? (
                    <div className={styles.grid}>
                        {servicesQuery.data?.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                ) : null}
            </Stack>
        </div>
    );
}
