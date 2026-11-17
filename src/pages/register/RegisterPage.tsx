import {
    Alert,
    Anchor,
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '@/services/authService';

import styles from '../login/LoginPage.module.css';

export function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Введите корректный email'),
            password: (value) =>
                value.length >= 8 && value.length <= 128 ? null : 'Пароль: 8-128 символов',
            passwordConfirm: (value, values) =>
                value === values.password ? null : 'Пароли не совпадают',
        },
    });

    const registerMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authService.register({ email, password }),
        onSuccess: async (_data, variables) => {
            await authService.login({ email: variables.email, password: variables.password });
            navigate('/', { replace: true });
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError('Этот email уже зарегистрирован');
                    return;
                }
                if (err.response?.status === 422) {
                    setError('Проверьте email и пароль');
                    return;
                }
            }
            setError('Не удалось зарегистрироваться. Попробуйте еще раз.');
        },
    });

    return (
        <div className={styles.page}>
            <Paper className={styles.card} p="xl" radius="lg" shadow="md">
                <Stack gap="lg">
                    <div>
                        <Text className={styles.brand}>RPS</Text>
                        <Title order={2} mt={4}>
                            Регистрация
                        </Title>
                        <Text c="dimmed" size="sm" mt={6}>
                            Создается аккаунт клиента. Имя и телефон можно заполнить в профиле.
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

                    <form
                        onSubmit={form.onSubmit((values) => {
                            setError(null);
                            registerMutation.mutate({
                                email: values.email.trim().toLowerCase(),
                                password: values.password,
                            });
                        })}
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="client@example.com"
                                autoComplete="email"
                                {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Пароль"
                                placeholder="Минимум 8 символов"
                                autoComplete="new-password"
                                {...form.getInputProps('password')}
                            />
                            <PasswordInput
                                label="Повтор пароля"
                                placeholder="Еще раз"
                                autoComplete="new-password"
                                {...form.getInputProps('passwordConfirm')}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                loading={registerMutation.isPending}
                                leftSection={<IconUserPlus size={18} />}
                            >
                                Создать аккаунт
                            </Button>
                        </Stack>
                    </form>

                    <Text size="sm" c="dimmed">
                        Уже есть аккаунт?{' '}
                        <Anchor component={Link} to="/login">
                            Войти
                        </Anchor>
                    </Text>
                </Stack>
            </Paper>
        </div>
    );
}
