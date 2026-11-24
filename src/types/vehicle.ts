export type Vehicle = {
    id: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    created_at: string;
};

export type CreateVehicleRequest = {
    make: string;
    model: string;
    year: number;
    plate: string;
};
