import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => Date.now() })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => Date.now() })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => false })
    deletedAt: boolean;
}
