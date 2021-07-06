import { ValidationSchema } from 'class-validator';
import { getMessages } from '../messages/index';

export const GetListValidatorSchemas: ValidationSchema = {
  name: 'GetListValidatorSchemas',
  properties: {
    limit: [
      {
        type: 'isNumberString',
        constraints: [true],
        message: getMessages('common', 'vi').LIMIT_IS_NUMBER
      },
      {
        type: 'isDefined',
        message: getMessages('common', 'vi').LIMIT_IS_REQUIRED
      }
    ],
    page: [
      {
        type: 'isNumberString',
        constraints: [true],
        message: getMessages('common', 'vi').PAGE_IS_NUMBER
      },
      {
        type: 'isDefined',
        message: getMessages('common', 'vi').PAGE_IS_REQUIRED
      }
    ],
  }
};
