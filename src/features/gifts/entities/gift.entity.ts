import { TypeEntity } from 'src/features/missions/entities/type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gifts' })
export class GiftEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => TypeEntity, (type) => type.gifts)
    type: TypeEntity;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'int' })
    count: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expiredAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
