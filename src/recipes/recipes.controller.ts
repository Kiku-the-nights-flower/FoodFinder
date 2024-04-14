import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request, @Body() createRecipeDto: CreateRecipeDto) {
    createRecipeDto.ownerId = request.user.id;
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll( @Query('take') take: number = 10, @Query('page') page: number = 1, @Query('userId') userId: number){
    return this.recipesService.findAll(take, page, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Req() req, @Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, req.user.id, updateRecipeDto).then(
      (result) => {return result;}, (error) => {throw error;}
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.recipesService.remove(+id, req.user.id);
  }
}
