import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MissionUserEntity } from './mission-user.entity';
import { TypeEntity } from './type.entity';

@Entity({ name: 'missions' })
export class MissionEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'float' })
    mark: number;

    @Column({ type: 'int' })
    total: number;

    @ManyToOne(() => TypeEntity, (type) => type.missions)
    type: TypeEntity;

    @OneToMany(() => MissionUserEntity, (missionUser) => missionUser.mission)
    missionUsers: MissionUserEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
