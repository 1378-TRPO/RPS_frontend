import { Alert, Button, Loader, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { queryKeys } from '@/queries/keys';
import { authService } from '@/services/authService';
import {
    buildProfileUpdatePayload,
    EMAIL_MAX_LENGTH,
    hasNormalizedProfileChanges,
    NAME_MAX_LENGTH,
    PHONE_MAX_LENGTH,
    type ProfileFormValues,
    toFormValues,
    validateProfileEmail,
    validateProfileName,
    validateProfilePhone,
} from '@/utils/profileValidation';

import styles from './ProfilePage.module.css';

const PROFILE_FIELDS = ['name', 'phone', 'email'] as const;

function apply422FieldErrors(
    err: unknown,
    setFieldError: (field: (typeof PROFILE_FIELDS)[number], message: string) => void,
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
        if (field === 'name' || field === 'phone' || field === 'email') {
            setFieldError(field, msg);
            applied = true;
        }
    }

    return applied;
}

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
        mode: 'controlled',
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
        form.initialize(toFormValues(profileQuery.data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileQuery.data]);

    const updateMutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.profile, data);
            void queryClient.invalidateQueries({ queryKey: queryKeys.me });
            setSaved(true);
            setError(null);
        },
        onError: (err: unknown) => {
            setSaved(false);
            if (apply422FieldErrors(err, form.setFieldError)) {
                setError(null);
                return;
            }
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

    if (profileQuery.isLoading) {
        return (
            <div className={styles.page}>
                <Loader color="mist" />
            </div>
        );
    }

    if (profileQuery.isError || !profileQuery.data) {
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
                        : 'Не удалось загрузить профиль.'}
                </Alert>
            </div>
        );
    }

    const initial = toFormValues(profileQuery.data);
    const hasChanges = hasNormalizedProfileChanges(form.values, initial);

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

                            const payload = buildProfileUpdatePayload(values, initial);
                            if (
                                payload.name === undefined &&
                                payload.phone === undefined &&
                                payload.email === undefined
                            ) {
                                setError('Нет изменений для сохранения');
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
                                maxLength={PHONE_MAX_LENGTH}
                                {...form.getInputProps('phone')}
                            />
                            <TextInput
                                label="Email"
                                placeholder="client@example.com"
                                description="Нельзя очистить; должен быть уникальным"
                                maxLength={EMAIL_MAX_LENGTH}
                                {...form.getInputProps('email')}
                            />
                            <Button
                                type="submit"
                                loading={updateMutation.isPending}
                                leftSection={<IconDeviceFloppy size={18} />}
                                w={{ base: '100%', xs: 'auto' }}
                                disabled={!hasChanges}
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
