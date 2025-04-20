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
import { QuestionType } from 'src/database/enums/questoinType.enum';
import { nanoid } from 'nanoid';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<FormDocument>) {}

  async createForm(userPayload: jwtPayload, createFormDto: CreateFormDto) {
    try {
      const emailQuestion = {
        type: QuestionType.SHORT_TEXT,
        isRequired: true,
        options: [],
        settings: {},
        order: 0,
      };
      const updatedQuestions = createFormDto.questions.map((q, index) => ({
        ...q,
        order: index + 1,
      }));

      const form = new this.formModel({
        ...createFormDto,
        GeneratedFormId: nanoid(10),
        questions: [emailQuestion, ...updatedQuestions],
        ownerId: userPayload.id,
      });

      await form.save();

      return {
        message: successMessage.form.success_create,
        GeneratedFormId: form.GeneratedFormId,
        form,
      };
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

  async getFormById(userPayload: jwtPayload, GeneratedFormId: string) {
    await this.validateForm(userPayload, GeneratedFormId);
    const form = await this.validateForm(userPayload, GeneratedFormId);
    return form;
  }

  async updateFormById(
    userPayload: jwtPayload,
    GeneratedFormId: string,
    dto: UpdateFormDto,
  ) {
    await this.validateForm(userPayload, GeneratedFormId);

    try {
      return this.formModel.findOneAndUpdate(
        { GeneratedFormId, ownerId: userPayload.id },
        { $set: dto },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(
        errorMessages.form_errors.form_update_failed,
      );
    }
  }

  async deleteFormById(userPayload: jwtPayload, GeneratedFormId: string) {
    const form = await this.validateForm(userPayload, GeneratedFormId);
    await this.formModel.deleteOne({
      GeneratedFormId,
      ownerId: userPayload.id,
    });
    return { message: successMessage.form.success_delete };
  }
  private async validateForm(userPayload: jwtPayload, GeneratedFormId: string) {
    const form = await this.formModel.findOne({
      GeneratedFormId,
      ownerId: userPayload.id,
    });
    if (!form) {
      throw new NotFoundException(errorMessages.form_errors.form_not_found);
    }
    return form;
  }
}
