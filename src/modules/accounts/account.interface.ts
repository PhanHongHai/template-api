import { Types, Document, Schema } from 'mongoose';
export interface IAccount extends Document {
	_id: Types.ObjectId;
	name: String;
	email: String;
	password: String;
	sex: Number;
	birthDay: Date;
	idCard: Number;
	phoneNumber: String;
	address: String;
	country: String;
	avatar: string;
	pathAvatar: string;
	role: String;
	ownerID: Types.ObjectId;
	status: Boolean;
	isBanned: Boolean;
	commissionRate: String;
	isActived: Boolean;
	isApproved: Boolean;
	tokenVerify: String;
	tokenReset: String;
//	comparePassword: Function;
	createdAt: Date;
	isDeleted: Boolean;
}

export interface ICreateAccount extends Document {
	name: String;
	email: String;
	password: String;
	sex: Number;
	birthDay: Date;
	idCard: Number;
	phoneNumber: String;
	address: String;
	country: String;
	role: String;
	ownerID: Types.ObjectId;
	commissionRate: String;
	tokenVerify: String;
	isApproved:Boolean;
}
export interface ICreateStudentAccount extends Document {
	name: String;
	tag: String;
	password: String;
	sex: Number;
	birthDay: Date;
	idCard: Number;
	phoneNumber: String;
	address: String;
	country: String;
	role: String;
	ownerID: Types.ObjectId;
	isApproved:Boolean;
}

export interface IUpdateAccount extends Document {
	name: String;
	email: String;
	password: String;
	sex: Number;
	birthDay: Date;
	idCard: Number;
	phoneNumber: String;
	address: String;
	country: String;
	avatar: string;
	pathAvatar: string;
	role: String;
	commissionRate: String;
	tokenVerify: String;
	isApproved:Boolean;
}

export interface IChangePassword extends Document {
	oldPassword: String;
	newPassword: String;
}
export interface IResetPassword extends Document {
	newPassword: String;
	confirmPassword: String;
	tokenChange: String;
}
export interface IGetReportTotalOptions {
	from: Date,
	to: Date,
	groupType: 'hour' | 'date',
  }