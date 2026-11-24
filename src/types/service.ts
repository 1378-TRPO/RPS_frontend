export type Service = {
    id: string;
    name: string;
    description: string | null;
    /** Денежное значение; API может отдать строку, чтобы не терять копейки */
    price: string | number;
    duration_minutes: number;
};
