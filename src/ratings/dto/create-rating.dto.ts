import { isNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @Min(1)
  @Max(5)
  @IsNumber()
  readonly rating: number;

  @IsString()
  @Length(1, 512)
  readonly comment: string;

  @IsNumber()
  readonly recipeId: number;
}
