import { TypeEntity } from 'src/features/missions/entities/type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gifts' })
export class GiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TypeEntity, (type) => type.gifts)
    type: TypeEntity;

    @Column()
    code: string;

    @Column()
    count: number;

    @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
    expiredAt: Date;
}
