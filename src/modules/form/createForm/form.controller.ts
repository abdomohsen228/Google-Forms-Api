import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentPayload';
import { jwtPayload } from 'src/decorators/jwtPayload';
import { FormService } from './form.service';
import { CreateFormDto } from '../dtos/createForm.dto';
import { UpdateFormDto } from '../dtos/updateForm.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('form')
export class formController {
  constructor(private readonly formService: FormService) {}
  @Post('')
  createForm(
    @CurrentUser() userPayload: jwtPayload,
    @Body() createFormDto: CreateFormDto,
  ) {
    return this.formService.createForm(userPayload, createFormDto);
  }

  @Get('')
  async getForms(
    @CurrentUser() userPayload: jwtPayload,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.formService.getFormsByUser(userPayload, page, limit);
  }

  @Get(':formId')
  getFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
  ) {
    return this.formService.getFormById(userPayload, formId);
  }

  @Patch(':formId')
  updateFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.updateFormById(userPayload, formId, updateFormDto);
  }

  @Delete(':formId')
  deleteFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
  ) {
    return this.formService.deleteFormById(userPayload, formId);
  }
}
