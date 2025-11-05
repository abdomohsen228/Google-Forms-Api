import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QuestionType } from 'src/database/enums/questoinType.enum';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  type?: QuestionType;

  @IsString()
  @IsNotEmpty()
  QuestionTitle: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  settings?: {
    maxLength?: number;
    allowedFileTypes?: string[];
    maxFileSizeMB?: number;
    minDate?: Date;
    maxDate?: Date;
  };

  @IsOptional()
  order?: number;
}
