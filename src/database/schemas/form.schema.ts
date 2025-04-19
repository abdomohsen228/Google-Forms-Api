import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { QuestionType } from '../enums/questoinType.enum';

@Schema({ timestamps: true })
export class Form extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: false, default: 'Untitled form' })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({
    type: [
      {
        type: {
          type: String,
          required: true,
          enum: Object.values(QuestionType),
        },
        isRequired: { type: Boolean, default: true },
        options: { type: [String], default: [] },
        settings: {
          maxLength: { type: Number },
          allowedFileTypes: { type: [String] },
          maxFileSizeMB: { type: Number },
          minDate: { type: Date },
          maxDate: { type: Date },
        },
        order: { type: Number },
      },
    ],
    default: [],
  })
  questions: any[];

  @Prop({
    type: [
      {
        submittedAt: { type: Date, default: Date.now },
        submittedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        answers: [
          {
            questionId: { type: mongoose.Schema.Types.ObjectId },
            answerText: { type: String },
            answerOptions: { type: [String] },
            fileUrl: { type: String },
          },
        ],
      },
    ],
    default: [],
  })
  submissions: any[];
}

export type FormDocument = Form & Document;
export const FormSchema = SchemaFactory.createForClass(Form);
