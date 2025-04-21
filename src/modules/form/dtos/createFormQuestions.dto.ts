import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from 'src/database/enums/questoinType.enum';

class QuestionSettings {
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedFileTypes?: string[];

  @IsOptional()
  @IsNumber()
  maxFileSizeMB?: number;

  @IsOptional()
  minDate?: Date;

  @IsOptional()
  maxDate?: Date;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  QuestionTitle: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => QuestionSettings)
  settings?: QuestionSettings;

  @IsOptional()
  @IsNumber()
  order?: number;
}
