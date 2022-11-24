import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MissionEntity } from './mission.entity';

@Entity('mission_user')
export class MissionUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    current: number;

    @ManyToOne(() => UserEntity, (user) => user.missionUsers)
    user: UserEntity;

    @ManyToOne(() => MissionEntity, (mission) => mission.missionUsers)
    mission: MissionEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ default: false })
    deletedAt?: boolean;
}
