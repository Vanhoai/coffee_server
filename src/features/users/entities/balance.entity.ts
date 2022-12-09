import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('balances')
export class BalanceEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'float' })
    amount: number;
}
