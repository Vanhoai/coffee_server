import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Next,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { CreateProductParams } from '../interfaces/CreateProductParams';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProductParams } from '../interfaces/UpdateProductParams';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async findAllProducts(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.productService.getAllProducts();
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get all products successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get(':id')
    async findProductById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.productService.findProductById(parseInt(id));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get product by id successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Body() body: CreateProductParams,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const response = await this.productService.createProduct({ ...body, image: file });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create product successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('create-no-image')
    async createProductNoImage(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { name, price, description, quantity } = req.body;
            const response = await this.productService.createProductNoImage({ name, price, description, quantity });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create product successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('create-no-image/:id')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImageForProduct(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.productService.uploadImageForProductNoImage(parseInt(id), file);
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Upload image for product successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateProduct(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Body() body: UpdateProductParams,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.productService.updateProduct(parseInt(id), { ...body, image: file });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Update product successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }
}
