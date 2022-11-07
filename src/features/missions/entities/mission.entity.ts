import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypeEntity } from './type.entity';

@Entity({ name: 'missions' })
export class MissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mark: number;

    @ManyToOne(() => TypeEntity, (type) => type.missions)
    type: TypeEntity;
}
