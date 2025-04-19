import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Form, FormDocument } from 'src/database/schemas/form.schema';
import { jwtPayload } from 'src/decorators/jwtPayload';
import { CreateFormDto } from '../dtos/createForm.dto';
import { UpdateFormDto } from '../dtos/updateForm.dto';
import successMessage from 'src/config/successMessages.json';
import errorMessages from 'src/config/errorMessages.json';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<FormDocument>) {}

  async createForm(userPayload: jwtPayload, createFormDto: CreateFormDto) {
    try {
      const form = new this.formModel({
        ...createFormDto,
        ownerId: userPayload.id,
      });
      await form.save();
      return { message: successMessage.form.success_create, form };
    } catch (error) {
      throw new BadRequestException(
        errorMessages.form_errors.form_creation_failed,
      );
    }
  }

  async getFormsByUser(
    userPayload: jwtPayload,
    page: number = 1,
    limit: number = 5,
  ) {
    const skip = (page - 1) * limit;

    const forms = await this.formModel
      .find({ ownerId: userPayload.id })
      .skip(skip)
      .limit(limit);

    if (!forms.length) {
      throw new NotFoundException(errorMessages.form_errors.form_not_found);
    }

    const totalForms = await this.formModel.countDocuments({
      ownerId: userPayload.id,
    });

    return {
      forms,
      page,
      limit,
      totalForms,
      totalPages: Math.ceil(totalForms / limit),
    };
  }

  async getFormById(userPayload: jwtPayload, formId: string) {
    this.validateObjectId(formId);

    const form = await this.validateForm(userPayload, formId);
    return form;
  }

  async updateFormById(
    userPayload: jwtPayload,
    formId: string,
    dto: UpdateFormDto,
  ) {
    this.validateObjectId(formId);

    await this.validateForm(userPayload, formId);

    try {
      return this.formModel.findOneAndUpdate(
        { _id: formId, ownerId: userPayload.id },
        { $set: dto },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(
        errorMessages.form_errors.form_update_failed,
      );
    }
  }

  async deleteFormById(userPayload: jwtPayload, formId: string) {
    this.validateObjectId(formId);

    await this.validateForm(userPayload, formId);
    return { message: successMessage.form.success_delete };
  }

  private validateObjectId(formId: string) {
    if (!Types.ObjectId.isValid(formId)) {
      throw new BadRequestException(errorMessages.form_errors.invalid_objectid);
    }
  }

  private async validateForm(userPayload: jwtPayload, formId: string) {
    const form = await this.formModel.findOne({
      _id: formId,
      ownerId: userPayload.id,
    });
    if (!form) {
      throw new NotFoundException(errorMessages.form_errors.form_not_found);
    }
    return form;
  }
}
