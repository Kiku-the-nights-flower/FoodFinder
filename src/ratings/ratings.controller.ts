import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ratings')
@UseGuards(AuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @Req() request) {
    return this.ratingsService.create(createRatingDto, request.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto, @Req() request) {
    return this.ratingsService.update(+id, updateRatingDto, request.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    return this.ratingsService.remove(+id, request.user);
  }
}
