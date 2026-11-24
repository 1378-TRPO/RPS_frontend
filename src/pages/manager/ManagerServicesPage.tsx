import {
    Alert,
    Badge,
    Button,
    Center,
    Group,
    Loader,
    Modal,
    NumberInput,
    Paper,
    Stack,
    Table,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { queryKeys } from '@/queries/keys';
import { useManagerServices } from '@/queries/useManagerServices';
import { catalogService } from '@/services/catalogService';
import type { ManagerService } from '@/types/service';
import { apply422FieldErrors } from '@/utils/apply422FieldErrors';
import { formatServiceDuration, formatServicePrice } from '@/utils/serviceFormat';
import {
    SERVICE_DESCRIPTION_MAX_LENGTH,
    SERVICE_NAME_MAX_LENGTH,
    type ServiceFormValues,
    toServiceWritePayload,
    validateServiceDescription,
    validateServiceDuration,
    validateServiceName,
    validateServicePrice,
} from '@/utils/serviceValidation';

import styles from './ManagerServicesPage.module.css';

const SERVICE_FIELDS = ['name', 'description', 'price', 'duration_minutes'] as const;

const emptyFormValues: ServiceFormValues = {
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
};

function toFormValues(service: ManagerService): ServiceFormValues {
    return {
        name: service.name,
        description: service.description,
        price: String(service.price),
        duration_minutes: String(service.duration_minutes),
    };
}

export function ManagerServicesPage() {
    const queryClient = useQueryClient();
    const servicesQuery = useManagerServices();
    const [formError, setFormError] = useState<string | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editing, setEditing] = useState<ManagerService | null>(null);
    const [deleting, setDeleting] = useState<ManagerService | null>(null);

    const form = useForm<ServiceFormValues>({
        mode: 'controlled',
        initialValues: emptyFormValues,
        validate: {
            name: validateServiceName,
            description: validateServiceDescription,
            price: validateServicePrice,
            duration_minutes: validateServiceDuration,
        },
    });

    const invalidateCatalog = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.managerServices }),
            queryClient.invalidateQueries({ queryKey: queryKeys.services }),
        ]);
    };

    const saveMutation = useMutation({
        mutationFn: async (values: ServiceFormValues) => {
            const payload = toServiceWritePayload(values);
            if (editing) {
                return catalogService.updateService(editing.id, payload);
            }
            return catalogService.createService(payload);
        },
        onSuccess: async () => {
            const wasEditing = Boolean(editing);
            setFormError(null);
            setEditorOpen(false);
            setEditing(null);
            form.reset();
            await invalidateCatalog();
            notifications.show({
                color: 'teal',
                title: wasEditing ? 'Услуга обновлена' : 'Услуга создана',
                message: 'Каталог обновлен.',
            });
        },
        onError: (err: unknown) => {
            if (apply422FieldErrors(err, SERVICE_FIELDS, form.setFieldError)) {
                setFormError(null);
                return;
            }
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setFormError('Услуга не найдена');
                return;
            }
            if (axios.isAxiosError(err) && err.response?.status === 403) {
                setFormError('Доступно только менеджеру');
                return;
            }
            setFormError('Не удалось сохранить услугу');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => catalogService.deactivateService(id),
        onSuccess: async () => {
            setDeleting(null);
            await invalidateCatalog();
            notifications.show({
                color: 'teal',
                title: 'Услуга деактивирована',
                message: 'В клиентском каталоге она больше не показывается.',
            });
        },
        onError: () => {
            notifications.show({
                color: 'red',
                title: 'Не удалось деактивировать',
                message: 'Список не изменен.',
            });
        },
    });

    const openCreate = () => {
        setEditing(null);
        setFormError(null);
        form.setValues(emptyFormValues);
        form.resetDirty(emptyFormValues);
        form.clearErrors();
        setEditorOpen(true);
    };

    const openEdit = (service: ManagerService) => {
        setEditing(service);
        setFormError(null);
        const values = toFormValues(service);
        form.setValues(values);
        form.resetDirty(values);
        form.clearErrors();
        setEditorOpen(true);
    };

    return (
        <div className={styles.page}>
            <Stack className={styles.layout} gap="lg">
                <Group justify="space-between" align="flex-start" gap="md">
                    <Title order={2}>Каталог услуг</Title>
                    <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
                        Добавить услугу
                    </Button>
                </Group>

                <Paper className={styles.card} p="xl" radius="lg" shadow="sm">
                    {servicesQuery.isLoading ? (
                        <Center py="md">
                            <Loader color="mist" />
                        </Center>
                    ) : null}

                    {servicesQuery.isError ? (
                        <Stack gap="sm">
                            <Alert
                                color="yellow"
                                variant="light"
                                icon={<IconAlertCircle size={16} />}
                            >
                                Не удалось загрузить список услуг.
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
                            Услуг пока нет. Добавьте первую.
                        </Text>
                    ) : null}

                    {!servicesQuery.isLoading &&
                    !servicesQuery.isError &&
                    (servicesQuery.data?.length ?? 0) > 0 ? (
                        <Table.ScrollContainer minWidth={640}>
                            <Table verticalSpacing="sm" highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Название</Table.Th>
                                        <Table.Th>Цена</Table.Th>
                                        <Table.Th>Длительность</Table.Th>
                                        <Table.Th>Статус</Table.Th>
                                        <Table.Th />
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {servicesQuery.data?.map((service) => (
                                        <Table.Tr
                                            key={service.id}
                                            className={
                                                service.is_active ? undefined : styles.inactiveRow
                                            }
                                        >
                                            <Table.Td>
                                                <Text fw={600}>{service.name}</Text>
                                                <Text c="dimmed" size="sm" lineClamp={2}>
                                                    {service.description}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>{formatServicePrice(service.price)}</Table.Td>
                                            <Table.Td>
                                                {formatServiceDuration(service.duration_minutes)}
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={service.is_active ? 'mist' : 'gray'}
                                                    variant="light"
                                                >
                                                    {service.is_active ? 'Активна' : 'Неактивна'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="xs" justify="flex-end" wrap="nowrap">
                                                    <Button
                                                        size="compact-sm"
                                                        variant="light"
                                                        leftSection={<IconPencil size={14} />}
                                                        onClick={() => openEdit(service)}
                                                    >
                                                        Изменить
                                                    </Button>
                                                    {service.is_active ? (
                                                        <Button
                                                            size="compact-sm"
                                                            variant="light"
                                                            color="red"
                                                            leftSection={<IconTrash size={14} />}
                                                            onClick={() => setDeleting(service)}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    ) : null}
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    ) : null}
                </Paper>
            </Stack>

            <Modal
                opened={editorOpen}
                onClose={() => {
                    if (saveMutation.isPending) return;
                    setEditorOpen(false);
                    setEditing(null);
                    setFormError(null);
                }}
                title={editing ? 'Редактировать услугу' : 'Новая услуга'}
                centered
            >
                <form
                    onSubmit={form.onSubmit((values) => {
                        if (saveMutation.isPending) return;
                        setFormError(null);
                        saveMutation.mutate(values);
                    })}
                >
                    <Stack gap="md">
                        {formError ? (
                            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
                                {formError}
                            </Alert>
                        ) : null}
                        <TextInput
                            label="Название"
                            maxLength={SERVICE_NAME_MAX_LENGTH}
                            {...form.getInputProps('name')}
                        />
                        <Textarea
                            label="Описание"
                            minRows={3}
                            maxLength={SERVICE_DESCRIPTION_MAX_LENGTH}
                            {...form.getInputProps('description')}
                        />
                        <TextInput
                            label="Цена"
                            placeholder="1500.00"
                            {...form.getInputProps('price')}
                        />
                        <NumberInput
                            label="Длительность, мин"
                            allowDecimal={false}
                            allowNegative={false}
                            clampBehavior="none"
                            hideControls
                            value={form.values.duration_minutes}
                            error={form.errors.duration_minutes}
                            onChange={(value) =>
                                form.setFieldValue('duration_minutes', String(value ?? ''))
                            }
                            onBlur={() => form.validateField('duration_minutes')}
                        />
                        <Group justify="flex-end">
                            <Button
                                variant="default"
                                onClick={() => {
                                    setEditorOpen(false);
                                    setEditing(null);
                                    setFormError(null);
                                }}
                                disabled={saveMutation.isPending}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" loading={saveMutation.isPending}>
                                Сохранить
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            <Modal
                opened={Boolean(deleting)}
                onClose={() => {
                    if (deleteMutation.isPending) return;
                    setDeleting(null);
                }}
                title="Деактивировать услугу?"
                centered
            >
                <Stack gap="md">
                    <Text size="sm">
                        «{deleting?.name}» останется в списке менеджера как неактивная и исчезнет из
                        клиентского каталога.
                    </Text>
                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => setDeleting(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Отмена
                        </Button>
                        <Button
                            color="red"
                            loading={deleteMutation.isPending}
                            onClick={() => {
                                if (!deleting || deleteMutation.isPending) return;
                                deleteMutation.mutate(deleting.id);
                            }}
                        >
                            Деактивировать
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
}
