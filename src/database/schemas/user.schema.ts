import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: false })
  username: string;

  @Prop()
  passwordHash: string;

  @Prop({ required: true, unique: true })
  email: string;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
