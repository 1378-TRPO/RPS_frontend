import { Alert, Button, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { queryKeys } from '@/queries/keys';
import { authService } from '@/services/authService';

import styles from './ProfilePage.module.css';

const phonePattern = /^\+[1-9]\d{6,14}$/;

export function ProfilePage() {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const profileQuery = useQuery({
        queryKey: queryKeys.profile,
        queryFn: () => authService.getProfile(),
        retry: false,
    });

    const form = useForm({
        initialValues: {
            name: '',
            phone: '',
            email: '',
        },
        validate: {
            name: (value) => {
                if (!value.trim()) return null;
                return value.trim().length <= 100 ? null : 'Имя до 100 символов';
            },
            phone: (value) => {
                if (!value.trim()) return null;
                return phonePattern.test(value.trim())
                    ? null
                    : 'Формат: + и 7-15 цифр, например +79991234567';
            },
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Введите корректный email'),
        },
    });

    useEffect(() => {
        if (profileQuery.data) {
            form.setValues({
                name: profileQuery.data.name ?? '',
                phone: profileQuery.data.phone ?? '',
                email: profileQuery.data.email,
            });
        }
        // form identity is stable enough; we sync when server data arrives
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileQuery.data]);

    const updateMutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.profile, data);
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
            }
            setError('Не удалось сохранить профиль');
        },
    });

    if (profileQuery.isError) {
        const status = axios.isAxiosError(profileQuery.error)
            ? profileQuery.error.response?.status
            : undefined;

        return (
            <div className={styles.page}>
                <Alert color="yellow" variant="light" icon={<IconAlertCircle size={16} />}>
                    {status === 403
                        ? 'Профиль с именем и телефоном доступен только роли client. Для вашей роли используйте данные учетной записи.'
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
                            Имя, телефон и email. Пароль и роль здесь не меняются.
                        </Text>
                    </div>

                    {error ? (
                        <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
                            {error}
                        </Alert>
                    ) : null}
                    {saved ? (
                        <Alert color="teal" variant="light" icon={<IconCheck size={16} />}>
                            Сохранено
                        </Alert>
                    ) : null}

                    <form
                        onSubmit={form.onSubmit((values) => {
                            setSaved(false);
                            setError(null);
                            updateMutation.mutate({
                                name: values.name.trim() || null,
                                phone: values.phone.trim() || null,
                                email: values.email.trim().toLowerCase(),
                            });
                        })}
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Имя"
                                placeholder="Иван Петров"
                                disabled={profileQuery.isLoading}
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label="Телефон"
                                placeholder="+79991234567"
                                disabled={profileQuery.isLoading}
                                {...form.getInputProps('phone')}
                            />
                            <TextInput
                                label="Email"
                                placeholder="client@example.com"
                                disabled={profileQuery.isLoading}
                                {...form.getInputProps('email')}
                            />
                            <Button
                                type="submit"
                                loading={updateMutation.isPending}
                                leftSection={<IconDeviceFloppy size={18} />}
                                w={{ base: '100%', xs: 'auto' }}
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
