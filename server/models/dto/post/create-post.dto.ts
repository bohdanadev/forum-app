import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  //IsMongoId,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsUrl()
  @IsOptional()
  imageUrl: string;
}
