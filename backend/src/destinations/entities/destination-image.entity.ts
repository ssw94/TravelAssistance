import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Destination } from './destination.entity';

@Entity('destination_images')
export class DestinationImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ default: false })
  isHero: boolean;

  @ManyToOne(() => Destination, (dest) => dest.gallery, { onDelete: 'CASCADE' })
  destination: Destination;

  @CreateDateColumn()
  createdAt: Date;
}
