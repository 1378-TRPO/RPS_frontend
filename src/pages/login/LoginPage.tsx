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
import { IconAlertCircle, IconCheck, IconLogin2 } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import styles from '@/pages/auth/AuthPage.module.css';
import { queryKeys } from '@/queries/keys';
import { queryClient } from '@/queries/queryClient';
import { authService } from '@/services/authService';
import { normalizeEmail, validateEmail, validatePassword } from '@/utils/authValidation';

type LoginLocationState = {
    registered?: boolean;
    registeredEmail?: string;
};

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = (location.state as LoginLocationState | null) ?? null;

    const [error, setError] = useState<string | null>(null);
    const [registeredNotice, setRegisteredNotice] = useState(Boolean(locationState?.registered));

    const form = useForm({
        initialValues: {
            email: locationState?.registeredEmail ?? '',
            password: '',
        },
        validate: {
            email: validateEmail,
            password: validatePassword,
        },
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.me });
            navigate('/', { replace: true });
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError('Неверный email или пароль');
                return;
            }
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                setError('Проверьте email и пароль');
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
                            Вход по email и паролю для ролей клиент, механик и менеджер. После входа
                            выдается JWT access token.
                        </Text>
                    </div>

                    {registeredNotice ? (
                        <Alert
                            color="teal"
                            variant="light"
                            icon={<IconCheck size={16} />}
                            onClose={() => setRegisteredNotice(false)}
                            withCloseButton
                        >
                            Аккаунт создан. Войдите с тем же email и паролем.
                        </Alert>
                    ) : null}

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
                            loginMutation.mutate({
                                email: normalizeEmail(values.email),
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
                                placeholder="Ваш пароль"
                                autoComplete="current-password"
                                maxLength={128}
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
