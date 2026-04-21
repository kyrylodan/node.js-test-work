export interface IToken {
    _id?: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
    role: string;
    refreshTokenExpiresAt?: Date;
}
export interface ITokenPayload {
    userId: string;
    role: string;
}
export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}
