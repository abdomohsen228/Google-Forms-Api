import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentPayload';
import { jwtPayload } from 'src/decorators/jwtPayload';
import { AuthGuard } from 'src/modules/auth/guards/auth.guards';
import { SubmitFormDto } from '../dtos/sunmitForm.dto';
import { SubmitFormService } from './submitForm.service';

@Controller('forms')
export class SubmitformController {
  constructor(private readonly submitformService: SubmitFormService) {}

  @Post(':formId/submit')
  public submitForm(
    @Param('formId') formId: string,
    @Body() submitFormDto: SubmitFormDto,
  ) {
    return this.submitformService.submitForm(formId, submitFormDto);
  }




  
  @UseGuards(AuthGuard)
  @Get(':formId/all-submission')
  public async getAllSubmission(
    @Param('formId') formId: string,
    @CurrentUser() userPayload: jwtPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 2,
  ) {
    return this.submitformService.getAllSubmissionsForForm(
      formId,
      userPayload,
      page,
      limit,
    );
  }
}
