import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('balances')
export class BalanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    amount: number;
}
