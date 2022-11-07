import { GiftEntity } from 'src/features/gifts/entities/gift.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MissionEntity } from './mission.entity';

@Entity({ name: 'types' })
export class TypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    percent: number;

    @OneToMany(() => MissionEntity, (mission) => mission.type)
    missions: MissionEntity[];

    @OneToMany(() => GiftEntity, (gift) => gift.type)
    gifts: GiftEntity[];
}
