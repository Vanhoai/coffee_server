import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail({
        from,
        to,
        subject,
        content,
    }: {
        from: string;
        to: string;
        subject: string;
        content: string;
    }): Promise<any> {
        await this.mailerService.sendMail({
            to,
            from,
            subject,
            text: content,
            html: '<b>Welcome</b>',
        });
    }
}
