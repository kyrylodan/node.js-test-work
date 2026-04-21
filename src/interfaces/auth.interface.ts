export interface ISignIn {
    email: string;
    password: string;
}

export interface ISignUp extends ISignIn {
    name: string;
    age: number;
    role?: string;
    accountType?: "basic" | "premium";
}
