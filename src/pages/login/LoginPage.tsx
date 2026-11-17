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
import { IconAlertCircle, IconLogin2 } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '@/services/authService';

import styles from './LoginPage.module.css';

export function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Введите корректный email'),
            password: (value) => (value.length >= 8 ? null : 'Минимум 8 символов'),
        },
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: () => {
            navigate('/', { replace: true });
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError('Неверный email или пароль');
                return;
            }
            setError('Не удалось войти. Попробуйте еще раз.');
        },
    });

    return (
        <div className={styles.page}>
            <Paper className={styles.card} p="xl" radius="lg" shadow="md">
                <Stack gap="lg">
                    <div>
                        <Text className={styles.brand}>RPS</Text>
                        <Title order={2} mt={4}>
                            Вход
                        </Title>
                        <Text c="dimmed" size="sm" mt={6}>
                            Войдите в аккаунт клиента, механика или менеджера.
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
                            loginMutation.mutate(values);
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
                                placeholder="Ваш пароль"
                                autoComplete="current-password"
                                {...form.getInputProps('password')}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                loading={loginMutation.isPending}
                                leftSection={<IconLogin2 size={18} />}
                            >
                                Войти
                            </Button>
                        </Stack>
                    </form>

                    <Text size="sm" c="dimmed">
                        Нет аккаунта?{' '}
                        <Anchor component={Link} to="/register">
                            Зарегистрироваться
                        </Anchor>
                    </Text>
                </Stack>
            </Paper>
        </div>
    );
}
