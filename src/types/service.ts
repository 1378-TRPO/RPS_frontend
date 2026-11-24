export type Service = {
    id: string;
    name: string;
    description: string;
    /** Денежное значение; API может отдать строку, чтобы не терять копейки */
    price: string | number;
    duration_minutes: number;
};
