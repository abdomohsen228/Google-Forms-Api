import { Module } from '@nestjs/common';
import { FormService } from './createForm/form.service';
import { formController } from './createForm/form.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from 'src/database/schemas/form.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SubmitformController } from './submitForm/submitForm.controller';
import { SubmitFormService } from './submitForm/submitForm.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    JwtModule,
    AuthModule,
    UserModule,
  ],
  providers: [FormService, SubmitFormService],
  controllers: [formController, SubmitformController],
  exports: [FormService],
})
export class FormModule {}
