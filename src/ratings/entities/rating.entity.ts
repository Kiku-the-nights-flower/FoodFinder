import { User } from '../../users/entities/user.entity';
import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity()
export class Rating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User)
  userId: number;

  @ManyToOne(() => Recipe, (recipe: Recipe) => recipe.ratings)
  recipe: number;
}
