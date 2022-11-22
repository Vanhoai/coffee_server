import { ProductParams } from './ProductParam';

export class CreateOrderParams {
    shop: number;
    address: string;
    voucher: number;
    user: number;
    products: ProductParams[];
}
