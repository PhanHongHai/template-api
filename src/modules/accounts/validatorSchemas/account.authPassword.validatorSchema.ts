import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');

export const AuthPasswordValidatorSchemas: ValidationSchema = {
	name: 'AuthPasswordValidatorSchemas',
	properties: {
		password: [
			{
				type: 'minLength',
				constraints: [6],
				message: messages.PASSWORD_MIN_IS_6,
			},
			{
				type: 'maxLength',
				constraints: [25],
				message: messages.PASSWORD_MAX_IS_25,
			},
			{
				type: 'isDefined',
				message: messages.PASSWORD_IS_REQUIRED,
			},
		]
	},
};
