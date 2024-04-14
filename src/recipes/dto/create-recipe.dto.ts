import { IsNumber, IsString, Length } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  ingredients: string;

  @IsString()
  steps: string;

  ownerId?: number;
}
