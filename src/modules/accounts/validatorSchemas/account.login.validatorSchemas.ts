import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');
export const LoginAccountValidatorSchema: ValidationSchema = {
  name: 'LoginAccountValidatorSchema',
  properties: {
    email: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.EMAIL_IS_REQUIRED
      },
      {
        type: 'isEmail',
        constraints : [IsEmail],
        message: messages.IS_EMAIL
      },
    ],
    password: [
      {
        type: 'isDefined',
        message: messages.PASSWORD_IS_REQUIRED
      }
     
    ],
}
};
export const LoginAccountStudentValidatorSchema: ValidationSchema = {
  name: 'LoginAccountStudentValidatorSchema',
  properties: {
    tag: [
      {
        type: 'isDefined',
        constraints : [true],
        message: messages.TAG_IS_REQUIRED
      },
    ],
    password: [
      {
        type: 'isDefined',
        message: messages.PASSWORD_IS_REQUIRED
      }
     
    ],
}
};
