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

import styles from '@/pages/auth/AuthPage.module.css';
import { authService } from '@/services/authService';
import {
    normalizeEmail,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    validateEmail,
    validatePassword,
} from '@/utils/authValidation';

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
            email: validateEmail,
            password: validatePassword,
            passwordConfirm: (value, values) =>
                value === values.password ? null : 'Пароли не совпадают',
        },
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            navigate('/login', {
                replace: true,
                state: {
                    registeredEmail: data.email,
                    registered: true,
                },
            });
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
                            Создается аккаунт клиента по email и паролю. После регистрации нужно
                            войти.
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
                                email: normalizeEmail(values.email),
                                // Пароль не trim: пробелы значимы, как на API
                                password: values.password,
                            });
                        })}
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="client@example.com"
                                autoComplete="email"
                                maxLength={254}
                                {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Пароль"
                                description={`${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} символов`}
                                placeholder="Придумайте пароль"
                                autoComplete="new-password"
                                maxLength={PASSWORD_MAX_LENGTH}
                                {...form.getInputProps('password')}
                            />
                            <PasswordInput
                                label="Повтор пароля"
                                placeholder="Еще раз"
                                autoComplete="new-password"
                                maxLength={PASSWORD_MAX_LENGTH}
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
