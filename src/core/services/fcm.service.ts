import { Injectable } from '@nestjs/common';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';

@Injectable()
export class FCMService {
    constructor(private readonly firebaseMessagingService: FirebaseMessagingService) {}

    async sendNotificationToOneUser({ id, title, body }): Promise<any> {
        // const response = await this.firebaseMessagingService.send();
    }
}
