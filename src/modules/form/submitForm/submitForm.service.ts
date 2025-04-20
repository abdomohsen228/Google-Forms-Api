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
    if (!form)
      throw new NotFoundException(errorMessages.form_errors.form_not_found);

    const alreadySubmitted = form.submissions.some(
      (submission) => submission.submittedBy.toString() === userPayload.id,
    );

    if (alreadySubmitted) {
      throw new BadRequestException(
        errorMessages.form_errors.already_submitted,
      );
    }

    for (const question of form.questions) {
      if (question.isRequired) {
        const answer = submitFormDto.answers.find(
          (a) => a.questionId === question._id.toString(),
        );
        if (!answer) {
          throw new BadRequestException(
            `${errorMessages.form_errors.filed_is_required} ${question._id}`,
          );
        }

        const isEmptyText =
          !answer.answerText || answer.answerText.trim().length === 0;
        const isEmptyOptions =
          !answer.answerOptions || answer.answerOptions.length === 0;
        const isFileMissing = question.type === 'file_upload' && !answer.file;

        if (isEmptyText && isEmptyOptions && isFileMissing) {
          throw new BadRequestException(
            `${errorMessages.form_errors.filed_is_required} ${question._id}`,
          );
        }
      }
    }

    const submissionAnswers = submitFormDto.answers.map((answer) => ({
      questionId: new Types.ObjectId(answer.questionId),
      answerText: answer.answerText,
      answerOptions: answer.answerOptions,
      ...(answer.file && {
        fileData: answer.file.data,
        fileName: answer.file.name,
        fileType: answer.file.type,
      }),
    }));

    form.submissions.push({
      submittedBy: new Types.ObjectId(userPayload.id),
      submittedAt: new Date(),
      answers: submissionAnswers,
    });
    await form.save();
    return {
      message: successMessage.form.success_submission,
    };
  }

  async getAllSubmissionsForForm(
    formId: string,
    userPayload: jwtPayload,
    page: number = 1,
    limit: number = 5,
  ) {
    const skip = (page - 1) * limit;

    const form = await this.formModel
      .findById(formId)
      .populate('submissions.submittedBy', 'email');

    if (!form) {
      throw new NotFoundException(errorMessages.form_errors.form_not_found);
    }

    if (form.ownerId.toString() !== userPayload.id) {
      throw new BadRequestException(errorMessages.auth_errors.unauthorized);
    }

    const totalSubmissions = form.submissions.length;

    const paginatedSubmissions = form.submissions
      .slice(skip, skip + limit)
      .map((submission) => ({
        submittedBy: submission.submittedBy.email,
        submittedAt: submission.submittedAt,
        answers: submission.answers.map((ans) => ({
          questionId: ans.questionId,
          answerText: ans.answerText,
          answerOptions: ans.answerOptions,
          ...(ans.fileData && {
            fileData: ans.fileData,
            fileName: ans.fileName,
            fileType: ans.fileType,
          }),
        })),
      }));

    return {
      submissions: paginatedSubmissions,
      page,
      limit,
      totalSubmissions,
      totalPages: Math.ceil(totalSubmissions / limit),
    };
  }

  async getSubmittedFormsByUser(
    userPayload: jwtPayload,
    page: number = 1,
    limit: number = 5,
  ) {
    const skip = (page - 1) * limit;
    const matchQuery = {
      submissions: {
        $elemMatch: { submittedBy: new Types.ObjectId(userPayload.id) },
      },
    };
    const forms = await this.formModel
      .find(matchQuery)
      .skip(skip)
      .limit(limit)
      .select('title description submissions');

    const totalForms = await this.formModel.countDocuments(matchQuery);

    const formattedForms = forms.map((form) => {
      const submission = form.submissions.find((s) =>
        s.submittedBy.equals(userPayload.id),
      );
      return {
        title: form.title,
        description: form.description,
        submittedAt: submission?.submittedAt,
        answers: submission?.answers.map((ans) => ({
          questionId: ans.questionId,
          answerText: ans.answerText,
          answerOptions: ans.answerOptions,
          ...(ans.fileData && {
            fileData: ans.fileData,
            fileName: ans.fileName,
            fileType: ans.fileType,
          }),
        })),
      };
    });

    return {
      submittedForms: formattedForms,
      page,
      limit,
      totalForms,
      totalPages: Math.ceil(totalForms / limit),
    };
  }
  async getCreatedFormsByUser(
    userPayload: jwtPayload,
    page: number = 1,
    limit: number = 5,
  ) {
    const skip = (page - 1) * limit;

    const forms = await this.formModel
      .find({ ownerId: new Types.ObjectId(userPayload.id) })
      .skip(skip)
      .limit(limit)
      .select('title description isPublic');

    const totalForms = await this.formModel.countDocuments({
      ownerId: new Types.ObjectId(userPayload.id),
    });

    return {
      createdForms: forms,
      page,
      limit,
      totalForms,
      totalPages: Math.ceil(totalForms / limit),
    };
  }
}
