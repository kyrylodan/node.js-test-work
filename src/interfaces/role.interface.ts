export interface IRole {
    _id: string;
    name: string;
    permissions: string[];
    description?: string;
    isActive: boolean;
}
