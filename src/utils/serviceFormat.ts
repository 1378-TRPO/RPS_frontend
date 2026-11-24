export function formatServicePrice(price: string | number): string {
    const amount = typeof price === 'number' ? price : Number(price);
    if (!Number.isFinite(amount)) {
        return String(price);
    }

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatServiceDuration(minutes: number): string {
    if (!Number.isFinite(minutes) || minutes < 0) {
        return `${minutes} мин`;
    }

    const wholeMinutes = Math.round(minutes);
    const hours = Math.floor(wholeMinutes / 60);
    const rest = wholeMinutes % 60;

    if (hours === 0) {
        return `${rest} мин`;
    }
    if (rest === 0) {
        return `${hours} ч`;
    }
    return `${hours} ч ${rest} мин`;
}
