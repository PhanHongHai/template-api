import { ValidationSchema } from 'class-validator';
import { getMessages } from '../messages/index';

export const GetReportValidatorSchemas: ValidationSchema = {
	name: 'GetReportValidatorSchemas',
	properties: {
		from: [
			{
				type: 'isDefined',
				message: getMessages('common', 'vi').FROM_IS_REQUIRED,
			},
		],
		to: [
			{
				type: 'isDefined',
				message: getMessages('common', 'vi').TO_IS_REQUIRED,
			},
		],
		groupType: [
			{
				type: 'isDefined',
				message: getMessages('common', 'vi').GROUP_TYPE_IS_REQUIRED,
			},
		],
	},
};
