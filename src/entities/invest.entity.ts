import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Interest } from './interest.entity';

export enum InvestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('invests')
export class Invest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: InvestStatus,
    default: InvestStatus.PENDING,
  })
  status: InvestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.invests)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Interest)
  interest: Interest;

  @Column()
  interestRateId: number;
}
