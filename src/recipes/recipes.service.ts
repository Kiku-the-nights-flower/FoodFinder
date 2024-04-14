import { BadRequestException, HttpException, Injectable, ParseIntPipe } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService {
  constructor(@InjectRepository(Recipe) private recipeRepository: Repository<Recipe>) {}

  create(createRecipeDto: CreateRecipeDto) {
    return this.recipeRepository.save(createRecipeDto);
  }

  async findAll(takeRecipes: number, page: number, userId?: number) {
    //https://stackoverflow.com/questions/53922503/how-to-implement-pagination-in-nestjs-with-typeorm#answer-67239246
    const skip = (page - 1) * takeRecipes;
    const [result, total] = await this.recipeRepository.findAndCount({
      take: takeRecipes,
      skip: skip,
      select: ['id', 'title', 'ownerId'],
      where: userId ? {ownerId: userId} : {}
    });

    return {
      data: result,
      count: total
    }
  }

  //filters needs to have attributes that match the recipe entity, e.g. {title: 'recipe title'}
  async filterRecipes(filters: any, takeRecipes: number, page: number) {
    const skip = (page - 1) * takeRecipes;
    const [result, total] = await this.recipeRepository.findAndCount({
      take: takeRecipes,
      skip: skip,
      where: filters
    });

    return {
      data: result,
      count: total
    }
  }

  findOne(id: number) {
    return this.recipeRepository.findOne({where: {id: id}})
  }

  update(recipeId: number, userId: number, updateRecipeDto: UpdateRecipeDto) {
    this.findOne(recipeId).then((recipe) => {
      if(recipe.ownerId !== userId){
        throw new BadRequestException('Not authorized to update this recipe');
      }
    });
    return this.recipeRepository.update(recipeId, updateRecipeDto);
  }

  async remove(recipeId: number, userId: number) {
    await this.findOne(recipeId).then((recipe) => {
      if(recipe.ownerId !== userId){
        throw new HttpException('Not authorized to update this recipe', 403);
      }
    });
    return this.recipeRepository.delete(recipeId);
  }

}
