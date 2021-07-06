import { ValidationSchema, IsUUID } from 'class-validator';
 

export const IdUuidValidatorSchemas: ValidationSchema = {
  name: 'IdUuidValidatorSchemas',
  properties: {
    // id: [
    //   {
    //     type: 'IsUUID',
    //     constraints: [IsUUID],
    //     message: 'Id truyền sai'
    //   },
    // ]
  }
};
