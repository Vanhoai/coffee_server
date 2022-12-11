import { Injectable } from '@nestjs/common';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';

@Injectable()
export class FCMService {
    constructor(private readonly firebaseMessagingService: FirebaseMessagingService) {}

    async sendNotificationToOneUser(token: string, title: string, body: string): Promise<any> {
        const message = {
            android: {
                notification: {
                    body,
                    title,
                },
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                    'apns-expiration': '360000',
                },
                payload: {
                    aps: {
                        alert: {
                            title,
                            body,
                        },
                        sound: 'default',
                    },
                    data: {},
                },
            },
            token,
        };

        const response = await this.firebaseMessagingService.send(message);

        return response;
    }

    async sendNotificationToAllUser(title: string, body: string): Promise<any> {
        const message = {
            android: {
                notification: {
                    body,
                    title,
                },
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                    'apns-expiration': '360000',
                },
                payload: {
                    aps: {
                        alert: {
                            title,
                            body,
                        },
                        sound: 'default',
                    },
                    data: {},
                },
            },
            topic: 'all',
        };

        const response = await this.firebaseMessagingService.send(message);

        return response;
    }
}
