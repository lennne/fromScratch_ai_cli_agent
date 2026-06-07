export interface AuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string; // Optional if using refresh rotations
    scope?: string;
}
