export type Service = {
    id: string;
    name: string;
    description: string;
    /** Денежное значение; API может отдать строку, чтобы не терять копейки */
    price: string | number;
    duration_minutes: number;
};

export type ManagerService = Service & {
    is_active: boolean;
};

export type ServiceWritePayload = {
    name: string;
    description: string;
    price: string;
    duration_minutes: number;
};
