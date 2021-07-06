import { ValidationSchema, IsBoolean } from 'class-validator';
import { getMessages } from '../../../common/messages/index';
const messages = getMessages('account', 'vi');

export const UpdateAccountValidatorSchema: ValidationSchema = {
	name: 'UpdateAccountValidatorSchema',
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
		],
		phoneNumber: [
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
	
    address: [
			{
				type: 'maxLength',
				constraints: [255],
				message: messages.ADDRESS_MAX_IS_255,
			},
		],
		idCard:[
			{
			  type:'minLength',
			  constraints:[9],
			  message:messages.IDCARD_MIN_LENGTH_IS_9,
			},
			{
			  type:'maxLength',
			  constraints:[9],
			  message:messages.IDCARD_MAX_LENGTH_IS_9,
			}
		  ]
	},
};
