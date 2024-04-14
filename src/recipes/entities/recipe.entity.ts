import { Rating } from '../../ratings/entities/rating.entity';
import { ManyToOne, OneToMany, JoinColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Image } from './image.entity';

@Entity()
export class Recipe {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  ingredients: string;

  @Column()
  steps: string;

  @OneToMany(() => Image, image => image.recipeId)
  images: Image;

  @OneToMany(() => Rating, rating => rating.recipe)
  ratings: Rating[];

  @Column({default: false})
  visible: boolean

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'ownerId' })
  ownerId: number;
}
