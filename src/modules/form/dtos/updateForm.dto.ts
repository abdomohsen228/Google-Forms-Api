import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { UpdateQuestionDto } from './updateFormQuestions.dto';

export class UpdateFormDto {
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
  questions?: UpdateQuestionDto[];
}
