import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');
export const VerifyAccountValidatorSchema: ValidationSchema = {
	name: 'VerifyAccountValidatorSchema',
	properties: {
		email: [
			{
				type: 'isDefined',
				constraints: [true],
				message: messages.EMAIL_IS_REQUIRED,
			},
			{
				type: 'isEmail',
				constraints: [IsEmail],
				message: messages.IS_EMAIL,
			},
		],
	},
};

export const UpdatePasswordValidatorSchema: ValidationSchema = {
	name: 'UpdatePasswordValidatorSchema',
	properties: {
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
		confirmPassword: [
			{
				type: 'isDefined',
				message: messages.CONFIRM_PASSWORD_EMPTY,
			},
		],
	},
};

export const ResetPasswordValidatorSchema: ValidationSchema = {
	name: 'ResetPasswordValidatorSchema',
	properties: {
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
		confirmPassword: [
			{
				type: 'isDefined',
				message: messages.CONFIRM_PASSWORD_EMPTY,
			},
		],
		tokenChange: [
			{
				type: 'isDefined',
				message: messages.TOKEN_IS_EMPTY,
			},
		],
	},
};
