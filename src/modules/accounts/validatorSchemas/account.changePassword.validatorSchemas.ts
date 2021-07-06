import { ValidationSchema } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');

export const ChangePasswordValidatorSchemas: ValidationSchema = {
	name: 'ChangePasswordValidatorSchemas',
	properties: {
		oldPassword: [
			{
				type: 'minLength',
				constraints: [6],
				message: messages.OLD_PASSWORD_MIN_IS_6,
			},
			{
				type: 'maxLength',
				constraints: [25],
				message: messages.OLD_PASSWORD_MAX_IS_25,
			},
			{
				type: 'isDefined',
				message: messages.OLD_PASSWORD_EMPTY,
			},
		],
		newPassword: [
			{
				type: 'minLength',
				constraints: [6],
				message: messages.NEW_PASSWORD_MIN_IS_6,
			},
			{
				type: 'maxLength',
				constraints: [25],
				message: messages.NEW_PASSWORD_MAX_IS_25,
			},
			{
				type: 'isDefined',
				message: messages.NEW_PASSWORD_EMPTY,
			},
		],
	},
};
