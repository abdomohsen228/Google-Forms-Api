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
  @Get('/submitted-forms')
  public async getSubmittedForms(
    @CurrentUser() userPayload: jwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.submitformService.getSubmittedFormsByUser(
      userPayload,
      page,
      limit,
    );
  }
  @Get('created-forms')
  async getCreatedForms(
    @CurrentUser() userPayload: jwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.submitformService.getCreatedFormsByUser(
      userPayload,
      page,
      limit,
    );
  }
}
