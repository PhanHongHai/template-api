import { ValidationSchema, IsEmail } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');
export const CreateAccountStudentValidatorSchema: ValidationSchema = {
	name: 'CreateAccountStudentValidatorSchema',
	properties: {
		// email: [
		//   {
		//     type: 'isDefined',
		//     constraints : [true],
		//     message: messages.EMAIL_IS_REQUIRED
		//   },
		//   {
		//     type: 'isEmail',
		//     constraints : [IsEmail],
		//     message: messages.IS_EMAIL
		//   },
		// ],
		// tag: [
		// 	{
		// 		type: 'isDefined',
		// 		message: messages.TAG_STUDENT_IS_REQUIRED,
		// 	},
		// ],
		// password: [
		// 	{
		// 		type: 'isDefined',
		// 		message: messages.PASSWORD_IS_REQUIRED,
		// 	},
		// 	{
		// 		type: 'minLength',
		// 		constraints: [6],
		// 		message: messages.PASSWORD_MIN_IS_6,
		// 	},
		// 	{
		// 		type: 'maxLength',
		// 		constraints: [25],
		// 		message: messages.PASSWORD_MAX_IS_25,
		// 	},
		// ],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		phoneNumber: [
			{
				type: 'isDefined',
				message: messages.MOBILE_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [2],
				message: messages.MIN_LENGTH_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [10],
				message: messages.MAX_LENGTH_IS_10,
			},
		],
		sex: [
			{
				type: 'isDefined',
				message: messages.SEX_IS_REQUIRED,
			},
		],
		birthDay: [
			{
				type: 'isDefined',
				message: messages.BIRTHDAY_IS_REQUIRED,
			},
		],
		idCard: [
			{
				type: 'isDefined',
				message: messages.IDCARD_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [9],
				message: messages.IDCARD_MIN_LENGTH_IS_9,
			},
			{
				type: 'maxLength',
				constraints: [9],
				message: messages.IDCARD_MAX_LENGTH_IS_9,
			},
		],
		address: [
			{
				type: 'isDefined',
				message: messages.ADDRESS_IS_REQUIRED,
			},
			{
				type: 'maxLength',
				constraints: [255],
				message: messages.ADDRESS_MAX_IS_100,
			},
		],
		country: [
			{
				type: 'isDefined',
				message: messages.COUNTRY_IS_REQUIRED,
			},
		],
	},
};

export const CreateAccountTeacherValidatorSchema: ValidationSchema = {
	name: 'CreateAccountTeacherValidatorSchema',
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
		password: [
			{
				type: 'isDefined',
				message: messages.PASSWORD_IS_REQUIRED,
			},
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
		],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		phoneNumber: [
			{
				type: 'isDefined',
				message: messages.MOBILE_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [2],
				message: messages.MIN_LENGTH_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [10],
				message: messages.MAX_LENGTH_IS_10,
			},
		],
		country: [
			{
				type: 'isDefined',
				message: messages.COUNTRY_IS_REQUIRED,
			},
		],
	},
};

export const CreateAccountPartnerValidatorSchema: ValidationSchema = {
	name: 'CreateAccountPartnerValidatorSchema',
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
		password: [
			{
				type: 'isDefined',
				message: messages.PASSWORD_IS_REQUIRED,
			},
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
		],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		phoneNumber: [
			{
				type: 'isDefined',
				message: messages.MOBILE_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [2],
				message: messages.MIN_LENGTH_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [10],
				message: messages.MAX_LENGTH_IS_10,
			},
		],
		country: [
			{
				type: 'isDefined',
				message: messages.COUNTRY_IS_REQUIRED,
			},
		],
		commissionRate: [
			{
				type: 'isDefined',
				message: messages.COMMISSIONRATE_IS_REQUIRED,
			},
		],
	},
};
export const CreateAccountAdminValidatorSchema: ValidationSchema = {
	name: 'CreateAccountAdminValidatorSchema',
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
		password: [
			{
				type: 'isDefined',
				message: messages.PASSWORD_IS_REQUIRED,
			},
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
		],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		phoneNumber: [
			{
				type: 'isDefined',
				message: messages.MOBILE_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [10],
				message: messages.MIN_LENGTH_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [10],
				message: messages.MAX_LENGTH_IS_10,
			},
		],
	},
};
export const CreateAccountEmploymentValidatorSchema: ValidationSchema = {
	name: 'CreateAccountEmploymentValidatorSchema',
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
		password: [
			{
				type: 'isDefined',
				message: messages.PASSWORD_IS_REQUIRED,
			},
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
		],
		name: [
			{
				type: 'isDefined',
				message: messages.NAME_IS_REQUIRED,
			},
		],
		phoneNumber: [
			{
				type: 'isDefined',
				message: messages.MOBILE_IS_REQUIRED,
			},
			{
				type: 'minLength',
				constraints: [10],
				message: messages.MIN_LENGTH_IS_10,
			},
			{
				type: 'maxLength',
				constraints: [10],
				message: messages.MAX_LENGTH_IS_10,
			},
		],
	},
};
