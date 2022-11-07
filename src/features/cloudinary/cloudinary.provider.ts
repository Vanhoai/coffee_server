import { CLOUDINARY } from './constant';
import { v2 } from 'cloudinary';
import { getConfig } from '../../config';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: (): void => {
        v2.config({
            cloud_name: getConfig().CLOUD_NAME,
            api_key: getConfig().API_KEY,
            api_secret: getConfig().API_SECRET,
        });
    },
};
