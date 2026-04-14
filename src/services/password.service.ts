import * as bcrypt from "bcrypt";
class PasswordService {
    async hashPassword(password:string):Promise<string> {
        return await bcrypt.hash(password,10)
    }
    async comparePassword(password:string,hashPassword:string):Promise<boolean> {
        return await bcrypt.compare(password,hashPassword)
    }
}

export const passwordService = new PasswordService()