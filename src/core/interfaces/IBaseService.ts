import { HttpException } from '@nestjs/common';
import { BaseEntity, Repository } from 'typeorm';
import { IBaseService } from '../services/base-repository.service';

export interface PaginatorOptions {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    name?: string;
}

export class BaseService<T extends BaseEntity> implements IBaseService<T> {
    constructor(private readonly repository: Repository<T>) {}

    async create(payload: any, ...args: any[]): Promise<T> {
        try {
            console.log(args);
            const entity: any = this.repository.create({ ...payload });
            return this.repository.save(entity);
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async update(id: number, payload: any, ...args: any[]): Promise<T> {
        try {
            console.log(args);
            const entity: any = await this.repository.createQueryBuilder('entity').where({ id }).getOne();
            if (!entity) {
                throw new HttpException('Not found', 404);
            }
            this.repository.merge(entity, payload);
            return this.repository.save(entity);
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async delete(id: number, ...args: any[]): Promise<T> {
        try {
            console.log(args);
            const entity: any = await this.repository.createQueryBuilder('entity').where({ id }).getOne();
            entity.deletedAt = true;
            return entity;
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async findAll(options?: PaginatorOptions, ...args: any[]): Promise<T[]> {
        try {
            console.log(args);
            const { page = 1, limit = 10, sort = 'id', order = 'ASC', name = '' } = options || {};
            const query = this.repository
                .createQueryBuilder('entity')
                .orderBy(`entity.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit);
            if (name) {
                query.where(`entity
                .name LIKE '%${name}%'`);
            }
            return query.getMany();
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async findOne(id: number, ...args: any[]): Promise<T> {
        try {
            console.log(args);
            const entity: any = await this.repository.createQueryBuilder('entity').where({ id }).getOne();
            if (!entity) {
                throw new HttpException('Not found', 404);
            }
            return entity;
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async findOneByOption(options: any, paginateOpts: PaginatorOptions, ...args: any[]): Promise<T> {
        try {
            console.log(args);
            const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = paginateOpts || {};
            const query = this.repository
                .createQueryBuilder('entity')
                .orderBy(`entity.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit);
            if (options) {
                query.where(options);
            }
            return query.getOne();
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }

    async findBy(options: any, ...args: any[]): Promise<T[]> {
        try {
            console.log(args);
            const query = this.repository.createQueryBuilder('entity');
            if (options) {
                query.where(options);
            }
            return query.getMany();
        } catch (error: any) {
            throw new HttpException(error.message || error, error.status || 500);
        }
    }
}
