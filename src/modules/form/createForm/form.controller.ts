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

@Controller('form')
export class formController {
  constructor(private readonly formService: FormService) {}

  @UseGuards(AuthGuard)
  @Post('')
  public createForm(
    @CurrentUser() userPayload: jwtPayload,
    @Body() createFormDto: CreateFormDto,
  ) {
    return this.formService.createForm(userPayload, createFormDto);
  }

  @UseGuards(AuthGuard)
  @Get('')
  public async getForms(
    @CurrentUser() userPayload: jwtPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 2,
  ) {
    return this.formService.getFormsByUser(userPayload, page, limit);
  }

  @Get(':formId')
  public getFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
  ) {
    return this.formService.getFormById(userPayload, formId);
  }

  @UseGuards(AuthGuard)
  @Patch(':formId')
  public updateFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.updateFormById(userPayload, formId, updateFormDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':formId')
  public deleteFormById(
    @CurrentUser() userPayload: jwtPayload,
    @Param('formId') formId: string,
  ) {
    return this.formService.deleteFormById(userPayload, formId);
  }
}
