import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from './users/entities/user.entity';
import { Recipe } from './recipes/entities/recipe.entity';
import { Rating } from './ratings/entities/rating.entity';
import { UsersController } from './users/users.controller';
import { RecipesController } from './recipes/recipes.controller';
import { AuthController } from './auth/auth.controller';
import { RatingsController } from './ratings/ratings.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { RecipesService } from './recipes/recipes.service';
import { UsersService } from './users/users.service';
import { RatingsService } from './ratings/ratings.service';


const jwtSecret = 'VerySecretKey';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Recipe, Rating]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'recipes',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '60m' },
    })],
  controllers: [AppController, UsersController, RecipesController, AuthController, RatingsController],
  providers: [AppService, AuthGuard, AuthService, RecipesService, UsersService, RatingsService],
})
export class AppModule {
}
