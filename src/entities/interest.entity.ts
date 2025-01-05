import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxAmount: number;

  @Column({ type: 'float' })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
}
