import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateQuestionDto } from './createFormQuestions.dto';

export class CreateFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  questions?: CreateQuestionDto[];
}
