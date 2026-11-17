import { Alert, Button, Loader, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { queryKeys } from '@/queries/keys';
import { authService, type UpdateProfilePayload } from '@/services/authService';
import {
    NAME_MAX_LENGTH,
    normalizeProfileEmail,
    normalizeProfileName,
    normalizeProfilePhone,
    validateProfileEmail,
    validateProfileName,
    validateProfilePhone,
} from '@/utils/profileValidation';

import styles from './ProfilePage.module.css';

type ProfileFormValues = {
    name: string;
    phone: string;
    email: string;
};

export function ProfilePage() {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const profileQuery = useQuery({
        queryKey: queryKeys.profile,
        queryFn: () => authService.getProfile(),
        retry: false,
    });

    const form = useForm<ProfileFormValues>({
        initialValues: {
            name: '',
            phone: '',
            email: '',
        },
        validate: {
            name: validateProfileName,
            phone: validateProfilePhone,
            email: validateProfileEmail,
        },
    });

    useEffect(() => {
        if (!profileQuery.data) return;
        form.setValues({
            name: profileQuery.data.name ?? '',
            phone: profileQuery.data.phone ?? '',
            email: profileQuery.data.email,
        });
        form.resetDirty({
            name: profileQuery.data.name ?? '',
            phone: profileQuery.data.phone ?? '',
            email: profileQuery.data.email,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileQuery.data]);

    const initial = useMemo(() => {
        if (!profileQuery.data) return null;
        return {
            name: profileQuery.data.name ?? '',
            phone: profileQuery.data.phone ?? '',
            email: profileQuery.data.email,
        };
    }, [profileQuery.data]);

    const updateMutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: async (data) => {
            queryClient.setQueryData(queryKeys.profile, data);
            await queryClient.invalidateQueries({ queryKey: queryKeys.me });
            form.setValues({
                name: data.name ?? '',
                phone: data.phone ?? '',
                email: data.email,
            });
            form.resetDirty({
                name: data.name ?? '',
                phone: data.phone ?? '',
                email: data.email,
            });
            setSaved(true);
            setError(null);
        },
        onError: (err: unknown) => {
            setSaved(false);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError('Этот email уже занят');
                    return;
                }
                if (err.response?.status === 403) {
                    setError('Профиль доступен только клиентам');
                    return;
                }
                if (err.response?.status === 422) {
                    setError('Проверьте поля формы');
                    return;
                }
                if (err.response?.status === 401) {
                    setError('Сессия истекла. Войдите снова');
                    return;
                }
            }
            setError('Не удалось сохранить профиль');
        },
    });

    if (profileQuery.isLoading) {
        return (
            <div className={styles.page}>
                <Loader color="mist" />
            </div>
        );
    }

    if (profileQuery.isError) {
        const status = axios.isAxiosError(profileQuery.error)
            ? profileQuery.error.response?.status
            : undefined;

        return (
            <div className={styles.page}>
                <Alert
                    color="yellow"
                    variant="light"
                    icon={<IconAlertCircle size={16} />}
                    maw={520}
                >
                    {status === 403
                        ? 'Профиль доступен только роли client.'
                        : status === 401
                          ? 'Сессия истекла. Войдите снова.'
                          : 'Не удалось загрузить профиль.'}
                </Alert>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Paper className={styles.card} p="xl" radius="lg" shadow="sm">
                <Stack gap="lg">
                    <div>
                        <Title order={2}>Профиль</Title>
                        <Text c="dimmed" size="sm" mt={6}>
                            Имя, телефон и email. Пустые имя или телефон очищают поле. Пароль и роль
                            здесь не меняются.
                        </Text>
                    </div>

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
                    {saved ? (
                        <Alert
                            color="teal"
                            variant="light"
                            icon={<IconCheck size={16} />}
                            onClose={() => setSaved(false)}
                            withCloseButton
                        >
                            Сохранено. Если меняли email, следующий вход - с новым адресом.
                        </Alert>
                    ) : null}

                    <form
                        onSubmit={form.onSubmit((values) => {
                            setSaved(false);
                            setError(null);

                            const nextName = normalizeProfileName(values.name);
                            const nextPhone = normalizeProfilePhone(values.phone);
                            const nextEmail = normalizeProfileEmail(values.email);

                            const payload: UpdateProfilePayload = {};
                            if (!initial || nextName !== (initial.name.trim() || null)) {
                                payload.name = nextName;
                            }
                            if (!initial || nextPhone !== (initial.phone.trim() || null)) {
                                payload.phone = nextPhone;
                            }
                            if (!initial || nextEmail !== normalizeProfileEmail(initial.email)) {
                                payload.email = nextEmail;
                            }

                            if (
                                payload.name === undefined &&
                                payload.phone === undefined &&
                                payload.email === undefined
                            ) {
                                setError('Измените хотя бы одно поле');
                                return;
                            }

                            updateMutation.mutate(payload);
                        })}
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Имя"
                                placeholder="Иван Петров"
                                description={`До ${NAME_MAX_LENGTH} символов, можно очистить`}
                                maxLength={NAME_MAX_LENGTH}
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label="Телефон"
                                placeholder="+79991234567"
                                description="Формат +79991234567, без пробелов и скобок"
                                {...form.getInputProps('phone')}
                            />
                            <TextInput
                                label="Email"
                                placeholder="client@example.com"
                                description="Нельзя очистить; должен быть уникальным"
                                maxLength={254}
                                {...form.getInputProps('email')}
                            />
                            <Button
                                type="submit"
                                loading={updateMutation.isPending}
                                leftSection={<IconDeviceFloppy size={18} />}
                                w={{ base: '100%', xs: 'auto' }}
                                disabled={!form.isDirty()}
                            >
                                Сохранить
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </div>
    );
}
