import { IconEye, IconEyeOff } from '@tabler/icons-react';

type PasswordVisibilityIconProps = {
    reveal: boolean;
};

/** Компактная иконка показа пароля для Mantine PasswordInput */
export function PasswordVisibilityIcon({ reveal }: PasswordVisibilityIconProps) {
    const Icon = reveal ? IconEyeOff : IconEye;
    return <Icon size={16} stroke={1.6} />;
}
