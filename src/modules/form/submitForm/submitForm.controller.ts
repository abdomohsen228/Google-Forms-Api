import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { CurrentUser } from 'src/decorators/currentPayload';
import { jwtPayload } from 'src/decorators/jwtPayload';
import { AuthGuard } from 'src/modules/auth/guards/auth.guards';
import { SubmitFormDto } from '../dtos/sunmitForm.dto';
import { SubmitFormService } from './submitForm.service';

@UseGuards(AuthGuard)
@Controller('forms')
export class SubmitformController {
  constructor(private readonly submitformService: SubmitFormService) {}

  @Post(':formId/submit')
  public submitForm(
    @Param('formId') formId: string,
    @Body() submitFormDto: SubmitFormDto,
    @CurrentUser() userPayload: jwtPayload,
  ) {
    return this.submitformService.submitForm(
      formId,
      userPayload,
      submitFormDto,
    );
  }
}
