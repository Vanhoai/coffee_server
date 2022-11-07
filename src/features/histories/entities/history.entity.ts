import { ImageEntity } from 'src/features/images/image.entity';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'histories' })
export class HistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ImageEntity, (image) => image.id)
    image?: ImageEntity;

    @ManyToOne(() => UserEntity, (user) => user.histories)
    user: UserEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
}
