import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: false, unique: true })
  username: string;

  @Prop()
  passwordHash: string;

  @Prop({ required: true, unique: true })
  email: string;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
