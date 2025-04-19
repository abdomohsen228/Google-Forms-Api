import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Form, FormDocument } from 'src/database/schemas/form.schema';
import { jwtPayload } from 'src/decorators/jwtPayload';
import errorMessages from 'src/config/errorMessages.json';
import successMessage from 'src/config/successMessages.json';

interface Answer {
  questionId: string;
  answerText?: string;
  answerOptions?: string[];
}

@Injectable()
export class SubmitFormService {
  constructor(
    @InjectModel(Form.name)
    private formModel: Model<FormDocument>,
  ) {}

  async submitForm(
    formId: string,
    userPayload: jwtPayload,
    dto: { answers: string },
    files: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<{ message: string }> {
    const form = await this.formModel.findById(formId);
    if (!form || !form.isPublic) {
      throw new NotFoundException(errorMessages.form_errors.form_not_found);
    }

    const parsedAnswers = (() => {
      try {
        return JSON.parse(dto.answers) as Answer[];
      } catch {
        throw new NotFoundException(
          errorMessages.form_errors.answer_submission_failed,
        );
      }
    })();

    const answersWithFiles = parsedAnswers.map((answer) => {
      const uploadedFile = files?.[answer.questionId]?.[0];
      return {
        ...answer,
        fileUrl: uploadedFile ? `/uploads/${uploadedFile.filename}` : undefined,
      };
    });

    form.submissions.push({
      submittedBy: new Types.ObjectId(userPayload.id),
      submittedAt: new Date(),
      answers: answersWithFiles,
    });

    await form.save();

    return { message: successMessage.form.success_submission };
  }
}
