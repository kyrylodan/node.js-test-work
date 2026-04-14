import path from "node:path";
import fs from "node:fs";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayload } from "../type/email-type-to-payload.type";
import * as handlebars from "handlebars";
import {emailConstants} from "../constants/email.constants";
import {configs} from "../configs/config";
import nodemailer, { Transporter } from "nodemailer";

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            from: "No reply",
            auth: {
                user: configs.SMTP_EMAIL,
                pass: configs.SMTP_PASSWORD,
            }
        });
    }
    public async sendManagerNotification(carId: string): Promise<void> {
        await this.sendMail(
            configs.MANAGER_EMAIL,
            EmailTypeEnum.OLD_VISITOR,
            {
                carId
            } as any
        );
    }
    private compileTemplate(templateName: string, context: any) {
        const templatePath = path.join(process.cwd(), "src", "templates", "views", `${templateName}.hbs`);
        const source = fs.readFileSync(templatePath, "utf8");

        const template = handlebars.compile(source);

        return template(context);
    }
    public async sendMail<T extends EmailTypeEnum>(
        to: string,
        type: T,
        context: EmailTypeToPayload[T]
    ): Promise<void> {
        const emailData = emailConstants[type];

        const subject = emailData.subject;

        const html =
            "template" in emailData
                ? this.compileTemplate(emailData.template, context)
                : emailData.text;

        await this.transporter.sendMail({
            from: configs.SMTP_EMAIL,
            to,
            subject,
            html,
        });
    }
}
export const emailService = new EmailService();