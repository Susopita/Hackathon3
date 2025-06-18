export interface LoginResponse {
    status: number;
    message: string;
    result: {
        token: string;
        username: string;
    };
}
