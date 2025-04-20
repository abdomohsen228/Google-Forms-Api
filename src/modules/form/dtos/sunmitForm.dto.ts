import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export default class FileAnswerDto {
  @IsString()
  data: string; // Base64 string

  @IsString()
  name: string;

  @IsString()
  type: string;
}

export class FormAnswerDto {
  @IsString()
  questionId: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsString({ each: true })
  answerOptions?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FileAnswerDto)
  file?: FileAnswerDto;
}

export class SubmitFormDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormAnswerDto)
  answers: FormAnswerDto[];
}
