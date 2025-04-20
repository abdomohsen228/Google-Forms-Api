import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Form, FormDocument } from 'src/database/schemas/form.schema';
import { jwtPayload } from 'src/decorators/jwtPayload';
import errorMessages from 'src/config/errorMessages.json';
import successMessage from 'src/config/successMessages.json';
import { SubmitFormDto } from '../dtos/sunmitForm.dto';

@Injectable()
export class SubmitFormService {
  constructor(
    @InjectModel(Form.name)
    private formModel: Model<FormDocument>,
  ) {}

  async submitForm(
    formId: string,
    userPayload: jwtPayload,
    submitFormDto: SubmitFormDto,
  ) {
    const form = await this.formModel.findById(formId);
    if (!form) throw new NotFoundException('Form not found');

    const submissionAnswers = submitFormDto.answers.map((answer) => {
      const question = form.questions.find(
        (q) => q._id.toString() === answer.questionId,
      );
      if (!question)
        throw new BadRequestException(
          `Question ${answer.questionId} not found`,
        );
      if (question.isRequired) {
        if (question.type === 'file_upload' && !answer.file) {
          throw new BadRequestException(
            `File is required for question ${answer.questionId}`,
          );
        }
        if (
          !answer.answerText &&
          !answer.answerOptions?.length &&
          !answer.file
        ) {
          throw new BadRequestException(
            `Answer is required for question ${answer.questionId}`,
          );
        }
      }
      return {
        questionId: new Types.ObjectId(answer.questionId),
        answerText: answer.answerText,
        answerOptions: answer.answerOptions,
        ...(answer.file && {
          fileData: answer.file.data,
          fileName: answer.file.name,
          fileType: answer.file.type,
        }),
      };
    });

    form.submissions.push({
      submittedBy: new Types.ObjectId(userPayload.id),
      submittedAt: new Date(),
      answers: submissionAnswers,
    });
    await form.save();
    return { message: 'Form submitted successfully' };
  }
}
