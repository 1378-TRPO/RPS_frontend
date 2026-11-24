import {
    Alert,
    Button,
    Center,
    Loader,
    NumberInput,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCar, IconRefresh } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { queryKeys } from '@/queries/keys';
import { useVehicles } from '@/queries/useVehicles';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/vehicle';
import {
    currentMaxVehicleYear,
    MAKE_MAX_LENGTH,
    MODEL_MAX_LENGTH,
    PLATE_MAX_LENGTH,
    toCreateVehiclePayload,
    validateVehicleMake,
    validateVehicleModel,
    validateVehiclePlate,
    validateVehicleYear,
    type VehicleFormValues,
    YEAR_MIN,
} from '@/utils/vehicleValidation';

import styles from './GaragePage.module.css';

const VEHICLE_FIELDS = ['make', 'model', 'year', 'plate'] as const;

function apply422FieldErrors(
    err: unknown,
    setFieldError: (field: (typeof VEHICLE_FIELDS)[number], message: string) => void,
): boolean {
    if (!axios.isAxiosError(err) || err.response?.status !== 422) {
        return false;
    }

    const detail = err.response.data?.detail;
    if (!Array.isArray(detail)) {
        return false;
    }

    let applied = false;
    for (const item of detail) {
        if (!item || typeof item !== 'object') continue;
        const loc = 'loc' in item ? item.loc : undefined;
        const msg = 'msg' in item ? item.msg : undefined;
        if (!Array.isArray(loc) || typeof msg !== 'string') continue;

        const field = loc[loc.length - 1];
        if (field === 'make' || field === 'model' || field === 'year' || field === 'plate') {
            setFieldError(field, msg);
            applied = true;
        }
    }

    return applied;
}

function VehicleList({
    vehicles,
    isLoading,
    isError,
    onRetry,
}: {
    vehicles: Vehicle[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
}) {
    if (isLoading) {
        return (
            <Center py="md">
                <Loader color="mist" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Stack gap="sm">
                <Alert color="yellow" variant="light" icon={<IconAlertCircle size={16} />}>
                    Не удалось загрузить список автомобилей.
                </Alert>
                <Button
                    variant="light"
                    color="mist"
                    leftSection={<IconRefresh size={16} />}
                    onClick={onRetry}
                    w={{ base: '100%', xs: 'auto' }}
                >
                    Повторить
                </Button>
            </Stack>
        );
    }

    if (!vehicles || vehicles.length === 0) {
        return (
            <Text c="dimmed" size="sm">
                Пока нет автомобилей. Добавьте первый формой ниже.
            </Text>
        );
    }

    return (
        <div>
            {vehicles.map((vehicle) => (
                <div key={vehicle.id} className={styles.vehicleRow}>
                    <div>
                        <Text fw={600}>
                            {vehicle.make} {vehicle.model}
                        </Text>
                        <Text className={styles.vehicleMeta}>{vehicle.year}</Text>
                    </div>
                    <Text className={styles.vehiclePlate}>{vehicle.plate}</Text>
                </div>
            ))}
        </div>
    );
}

export function GaragePage() {
    const queryClient = useQueryClient();
    const vehiclesQuery = useVehicles();
    const [error, setError] = useState<string | null>(null);
    const maxYear = currentMaxVehicleYear();

    const form = useForm<VehicleFormValues>({
        mode: 'controlled',
        initialValues: {
            make: '',
            model: '',
            year: '',
            plate: '',
        },
        validate: {
            make: validateVehicleMake,
            model: validateVehicleModel,
            year: (value) => validateVehicleYear(value),
            plate: validateVehiclePlate,
        },
    });

    const createMutation = useMutation({
        mutationFn: vehicleService.createVehicle,
        onSuccess: async () => {
            setError(null);
            form.reset();
            await queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
            notifications.show({
                color: 'teal',
                title: 'Автомобиль добавлен',
                message: 'Список обновлен.',
            });
        },
        onError: (err: unknown) => {
            if (apply422FieldErrors(err, form.setFieldError)) {
                setError(null);
                return;
            }
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 403) {
                    setError('Гараж доступен только клиентам');
                    return;
                }
                if (err.response?.status === 422) {
                    setError('Проверьте поля формы');
                    return;
                }
            }
            setError('Не удалось добавить автомобиль');
        },
    });

    return (
        <div className={styles.page}>
            <Stack className={styles.layout} gap="lg">
                <Title order={2}>Гараж</Title>

                <Paper className={styles.card} p="xl" radius="lg" shadow="sm">
                    <Stack gap="md">
                        <Title order={4}>Мои автомобили</Title>
                        <VehicleList
                            vehicles={vehiclesQuery.data}
                            isLoading={vehiclesQuery.isLoading}
                            isError={vehiclesQuery.isError}
                            onRetry={() => {
                                void vehiclesQuery.refetch();
                            }}
                        />
                    </Stack>
                </Paper>

                <Paper className={styles.card} p="xl" radius="lg" shadow="sm">
                    <Stack gap="lg">
                        <Title order={4}>Добавить автомобиль</Title>

                        {error ? (
                            <Alert
                                color="red"
                                variant="light"
                                icon={<IconAlertCircle size={16} />}
                                onClose={() => setError(null)}
                                withCloseButton
                            >
                                {error}
                            </Alert>
                        ) : null}

                        <form
                            onSubmit={form.onSubmit((values) => {
                                if (createMutation.isPending) return;
                                setError(null);
                                createMutation.mutate(toCreateVehiclePayload(values));
                            })}
                        >
                            <Stack gap="md">
                                <TextInput
                                    label="Марка"
                                    placeholder="Toyota"
                                    maxLength={MAKE_MAX_LENGTH}
                                    {...form.getInputProps('make')}
                                />
                                <TextInput
                                    label="Модель"
                                    placeholder="Camry"
                                    maxLength={MODEL_MAX_LENGTH}
                                    {...form.getInputProps('model')}
                                />
                                <NumberInput
                                    label="Год"
                                    placeholder="2018"
                                    allowDecimal={false}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    min={YEAR_MIN}
                                    max={maxYear}
                                    hideControls
                                    value={
                                        form.values.year === ''
                                            ? undefined
                                            : Number(form.values.year)
                                    }
                                    error={form.errors.year}
                                    onChange={(value) => {
                                        form.setFieldValue(
                                            'year',
                                            value === '' || value === undefined
                                                ? ''
                                                : String(value),
                                        );
                                    }}
                                    onBlur={() => form.validateField('year')}
                                />
                                <TextInput
                                    label="Госномер"
                                    placeholder="A123BC77"
                                    maxLength={PLATE_MAX_LENGTH}
                                    {...form.getInputProps('plate')}
                                />
                                <Button
                                    type="submit"
                                    loading={createMutation.isPending}
                                    leftSection={<IconCar size={18} />}
                                    w={{ base: '100%', xs: 'auto' }}
                                >
                                    Добавить автомобиль
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Stack>
        </div>
    );
}
