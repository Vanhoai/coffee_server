import { PaginatorOptions } from '../interfaces/IBaseService';

export interface IBaseService<T> {
    findAll(options?: PaginatorOptions, ...args: any[]): Promise<T[]>;
    findOne(id: number, ...args: any[]): Promise<T>;
    findOneByOption(options: any, paginateOpts: PaginatorOptions, ...args: any[]): Promise<T>;
    findBy(options: any, ...args: any[]): Promise<T[]>;
    update(id: number, payload: any, ...args: any[]): Promise<T>;
    create(payload: any, ...args: any[]): Promise<T>;
    delete(id: number, ...args: any[]): Promise<T>;
}
