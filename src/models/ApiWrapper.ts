export interface ApiWrapper<T> {
    success: boolean;
    message: string;
    data: T | null;
    status: number;
}