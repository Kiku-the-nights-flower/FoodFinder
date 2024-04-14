import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../recipes/entities/recipe.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RatingsService {

  constructor(
    @InjectRepository(Rating) private ratingRep: Repository<Rating>,
  ) {
  }

  create(createRatingDto: CreateRatingDto, user: User) {
    this.ratingRep.findOne({where: {recipe: createRatingDto.recipeId, userId: user.id}}).then((rating) => {
      if (rating) {
        throw new BadRequestException('Rating already exists');
      }
    });

    return this.ratingRep.insert(createRatingDto);
  }

  update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    this.ratingRep.findOne({where: {id: id}}).then((rating) => {
      if (!rating) {
        throw new BadRequestException('Rating does not exist');
      }
      if (rating.userId !== userId) {
        throw new BadRequestException('User is not the owner of the rating');
      }
    });
    return this.ratingRep.update(id, updateRatingDto);
  }

  remove(recipeId: number, userId: number) {
    this.ratingRep.findOne({where: {id: recipeId}}).then((rating) => {
      if (!rating) {
        throw new BadRequestException('Rating does not exist');
      }

      if (rating.userId !== userId) {
        throw new BadRequestException('User is not the owner of the rating');
      }
    });
    return this.ratingRep.delete(recipeId);
  }
}
