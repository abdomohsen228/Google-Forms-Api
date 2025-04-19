import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { QuestionType } from 'src/database/enums/questoinType.enum';

export class CreateQuestionDto {
  @IsString()
  type: QuestionType;

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
