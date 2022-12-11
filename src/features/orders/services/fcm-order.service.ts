import { Injectable } from '@nestjs/common';
import { FCMService } from 'src/core/services/fcm.service';

@Injectable()
export class FCMOrderService {
    constructor(private readonly fcmService: FCMService) {}

    async pushNotification({ token, title, body }: { token: string; title: string; body: string }): Promise<any> {
        const response = await this.fcmService.sendNotificationToOneUser(token, title, body);
        return response;
    }
}
