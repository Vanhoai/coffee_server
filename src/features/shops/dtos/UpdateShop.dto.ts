export class UpdateShopDto {
    location?: string;
    description?: string;
    longitude?: number;
    latitude?: number;
    file?: Express.Multer.File;
}
