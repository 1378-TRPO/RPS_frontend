import { Alert, Button, NumberInput, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCar } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { vehicleService } from '@/services/vehicleService';
import { apply422FieldErrors } from '@/utils/apply422FieldErrors';
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

export function GaragePage() {
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
        onSuccess: () => {
            setError(null);
            form.reset();
            notifications.show({
                color: 'teal',
                title: 'Автомобиль добавлен',
                message: 'Можно добавить еще один.',
            });
        },
        onError: (err: unknown) => {
            if (apply422FieldErrors(err, VEHICLE_FIELDS, form.setFieldError)) {
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
            <Paper className={styles.card} p="xl" radius="lg" shadow="sm">
                <Stack gap="lg">
                    <Title order={2}>Гараж</Title>

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
                                clampBehavior="none"
                                min={YEAR_MIN}
                                max={maxYear}
                                hideControls
                                value={form.values.year}
                                error={form.errors.year}
                                onChange={(value) =>
                                    form.setFieldValue('year', String(value ?? ''))
                                }
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
        </div>
    );
}
