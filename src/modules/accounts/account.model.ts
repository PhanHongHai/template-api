import * as mongoose from 'mongoose';

import { Schema, Types } from 'mongoose';
import { IAccount } from './account.interface';
import mongoosePaginate from 'mongoose-paginate';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const AccountSchema = new Schema(
	{
		email: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		tag:{
			type:String,
			required: false,
		},
		name: {
			type: String,
			required: true,
		},
		sex: {
			type: Number,
			required: false,
		},
		birthDay: {
			type: Date,
			required: false,
		},
		idCard: {
			type: Number,
			required: false,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
		avatar: {
			type: String,
			required: false,
		},
		pathAvatar:{
			type: String,
			required: false
	},
		role: {
			type: String,
			required: true,
		},
		ownerID: {
			type: Types.ObjectId,
			ref: 'accounts',
			required: false,
		},
		isInClass: {
			type: Boolean,
			default: false,
			required: true,
		},
		isBanned: {
			type: Boolean,
			required: false,
		},
		commissionRate: {
			type: String,
			required: false,
		},
		tokenReset: {
			type: String,
			required: false,
		},
		tokenVerify: {
			type: String,
			required: false,
		},
		isApproved: {
			type: Boolean,
			default: true,
			required: false,
		},
		isActived: {
			type: Boolean,
			default: false,
			required: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

AccountSchema.pre<IAccount>('save', function(next) {
	// only hash the password if it has been modified (or is new)
	if (!this.isModified('password')) {
		return next();
	}
	// Hash password
	const hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	next();
});
// AccountSchema.pre<IAccount>('updateOne', function(next) {
// 	console.log(this.password);
// 	if (this.password) {

// 		// Hash password
// 		const hash = bcrypt.hashSync(this.password, salt);
// 		this.password = hash;
// 	}
// 	next();
// });

// AccountSchema.methods.comparePassword = function(password: string) {
// 	const user = this;
// 	console.log(this);
// 	console.log(bcrypt.compareSync(password, user.password));
// 	return bcrypt.compareSync(password, user.password);
// };

AccountSchema.plugin(mongoosePaginate);
const AccountModel = mongoose.model<IAccount>('accounts', AccountSchema);
export default AccountModel;
