import AccountModel from './account.model';
import {
	IAccount,
	ICreateAccount,
	IUpdateAccount,
	IGetReportTotalOptions,
	ICreateStudentAccount,
} from './account.interface';
import mongoose, { Types } from 'mongoose';
import moment from 'moment';

class AccountRepository {
	constructor() {}

	// analysis account Dashboard
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCount(option: object): Promise<number> {
		return await AccountModel.count({
			...option,
			isDeleted: false,
		});
	}
	/**
	 * get count by option
	 * @param option oject
	 */
	async getCountAll(option: object): Promise<number> {
		return await AccountModel.count({
			...option,
		});
	}

	/**
	 * get account by id
	 * @param targetId
	 */
	async getById(targetId: Types.ObjectId, option: object, selectOption: string): Promise<IAccount | null> {
		return AccountModel.findOne({
			_id: targetId,
			...option,
			isDeleted: false,
		}).select(selectOption);
	}
	/**
	 * get account by id
	 * @param targetId string
	 */
	async getManyByOwnerID(
		data: object,
		limit: number = 10,
		page: number = 1,
		keyword: string = '',
	): Promise<IAccount | null | any> {
		const regex = new RegExp(keyword, 'i');
		return AccountModel.paginate(
			{
				...data,
				isDeleted: false,
				$or: [
					{
						name: { $regex: regex },
					},
					{
						email: { $regex: regex },
					},
				],
			},
			{
				populate: { path: 'ownerID', model: AccountModel },
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '-password ',
			},
		);
	}
	/**
	 * get account super admin
	 */
	async getAccountSuperAdmin(): Promise<IAccount | null> {
		return AccountModel.findOne({
			role: 'admin',
			isDeleted: false,
		});
	}
	/**
	 * get account by option
	 * @param option string
	 */
	async getAccountByOption(option: object): Promise<IAccount | null> {
		return AccountModel.findOne({
			...option,
			isDeleted: false,
		});
	}

	/**
	 * get all account
	 * @param data any
	 * @param limit number
	 * @param page number
	 */
	async getAll(data: any = {}, limit: number = 10, page: number = 1): Promise<IAccount | null | any> {
		return AccountModel.paginate(
			{
				...data,
				isDeleted: false,
			},
			{
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '-password ',
			},
		);
	}
	async findAccountByVerifyToken(verifyToken: string): Promise<IAccount | null> {
		return AccountModel.findOne({
			tokenVerify: verifyToken,
			isDeleted: false,
		}).select('-password');
	}
	async findAccountByChangeToken(tokenChange: String) {
		return AccountModel.findOne({
			tokenChange,
			isDeleted: false,
		}).select('-password');
	}
	/**
	 * search account by keyword || option
	 * @param keyword string
	 * @param options object
	 * @param limit number
	 * @param page number
	 */
	async search(
		keyword: string = '',
		options: any = {},
		limit: number = 10,
		page: number = 1,
	): Promise<IAccount | null | any> {
		const regex = new RegExp(keyword, 'i');
		return AccountModel.paginate(
			{
				...options,
				isDeleted: false,
				$or: [{ email: { $regex: regex } }, { name: { $regex: regex } }],
			},
			{
				populate: 'ownerID',
				sort: { createdAt: -1 },
				limit: Number(limit),
				page: Number(page),
				select: '-password',
			},
		);
	}
	/**
	 * create account
	 * @param data object
	 */
	async create(data: ICreateAccount | ICreateStudentAccount): Promise<IAccount | null> {
		return await AccountModel.create(data);
	}
	/**
	 * update account
	 * @param id object ID
	 * @param dataUpdate object
	 */
	async update(id: Types.ObjectId, dataUpdate: object): Promise<IAccount | null | any> {
		const isUpdated = await AccountModel.updateOne(
			{
				_id: id,
			},
			{
				...dataUpdate,
			},
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}
	/**
	 * update many account
	 * @param id object ID
	 * @param dataUpdate object
	 */
	async updateMany(option: object, dataUpdate: object): Promise<IAccount | null | any> {
		const isUpdated = await AccountModel.updateMany(
			{
				...option,
			},
			{
				...dataUpdate,
			},
		);
		if (isUpdated.nModified > 0) {
			return true;
		}
		return false;
	}
	/**
	 * delete account
	 * @param id objectID
	 */
	async delete(id: String): Promise<Boolean> {
		const isDelete = await AccountModel.updateOne(
			{
				_id: id,
				role: { $ne: 'admin' },
			},
			{ isDeleted: true },
		);
		if (isDelete.nModified > 0) {
			return true;
		}
		return false;
	}

	async getReportsTotalsByGroup(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: 0,
					totalStudent: {
						$sum: {
							$cond: [{ $eq: ['$role', 'student'] }, 1, 0],
						},
					},
					totalStudentCreateByPartner: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $ifNull: ['$ownerID', false] }] }, 1, 0],
						},
					},
					totalStudentNotActive: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isActived', false] }] }, 1, 0],
						},
					},
					totalStudentNotApprove: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isApproved', false] }] }, 1, 0],
						},
					},

					totalTeacher: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'teacher'] }, { $eq: ['$role', 'teacher'] }] }, 1, 0],
						},
					},
					totalPartner: {
						$sum: {
							$cond: [{ $eq: ['$role', 'partner'] }, 1, 0],
						},
					},
					totalPartnerNotActive: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'partner'] }, { $eq: ['$isActived', false] }] }, 1, 0],
						},
					},
					totalEmployment: {
						$sum: {
							$cond: [{ $eq: ['$role', 'employment'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					totalAccount: 1,
					totalStudent: 1,
					totalStudentCreateByPartner: 1,
					totalStudentNotActive: 1,
					totalStudentNotApprove: 1,
					totalTeacher: 1,
					totalPartner: 1,
					totalPartnerNotActive: 1,
					totalEmployment: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					totalAccount: 1,
					totalStudent: 1,
					totalStudentCreateByPartner: 1,
					totalStudentNotActive: 1,
					totalStudentNotApprove: 1,
					totalTeacher: 1,
					totalPartner: 1,
					totalPartnerNotActive: 1,
					totalEmployment: 1,
			  };
	}
	async getReportsTotals() {
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$group: {
					_id: 0,
					totalAccount: {
						$sum: 1,
					},
					totalStudent: {
						$sum: {
							$cond: [{ $eq: ['$role', 'student'] }, 1, 0],
						},
					},
					totalStudentCreateByPartner: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ['$role', 'student'] },
										{ $ifNull: ['$ownerID', false] },
										{ $eq: ['$isApproved', false] },
									],
								},
								1,
								0,
							],
						},
					},
					totalStudentNotActive: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isActived', false] }] }, 1, 0],
						},
					},
					totalStudentNotApprove: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isApproved', false] }] }, 1, 0],
						},
					},

					totalTeacher: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'teacher'] }, { $eq: ['$role', 'teacher'] }] }, 1, 0],
						},
					},
					totalPartner: {
						$sum: {
							$cond: [{ $eq: ['$role', 'partner'] }, 1, 0],
						},
					},
					totalPartnerNotActive: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'partner'] }, { $eq: ['$isActived', false] }] }, 1, 0],
						},
					},
					totalEmployment: {
						$sum: {
							$cond: [{ $eq: ['$role', 'employment'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					totalAccount: 1,
					totalStudent: 1,
					totalStudentCreateByPartner: 1,
					totalStudentNotActive: 1,
					totalStudentNotApprove: 1,
					totalTeacher: 1,
					totalPartner: 1,
					totalPartnerNotActive: 1,
					totalEmployment: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					totalAccount: 1,
					totalStudent: 1,
					totalStudentCreateByPartner: 1,
					totalStudentNotActive: 1,
					totalStudentNotApprove: 1,
					totalTeacher: 1,
					totalPartner: 1,
					totalPartnerNotActive: 1,
					totalEmployment: 1,
			  };
	}

	async reportsAccountActivedDates(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					// isActive: true,
					// isVerifyEmail: true,
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: options.groupType === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d',
							date: '$createdAt',
						},
					},
					totalAccountStudent: {
						$sum: {
							// $cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isActived', true] }] }, 1, 0],
							$cond: [{ $eq: ['$role', 'student'] }, 1, 0],
						},
					},
					totalAccountPartner: {
						$sum: {
							// $cond: [{ $and: [{ $eq: ['$role', 'partner'] }, { $eq: ['$isActived', true] }] }, 1, 0],
							$cond: [{ $eq: ['$role', 'partner'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					date: {
						$dateFromString: {
							dateString: '$_id',
							format: options.groupType === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d',
						},
					},
					totalAccountStudent: 1,
					totalAccountPartner: 1,
				},
			},
			{
				$sort: {
					date: -1,
				},
			},
		]);
		return reports;
	}

	async reportsUserAreas(type: string) {
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					role: type,
				},
			},
			{
				$group: {
					_id: '$country',
					totalUser: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: 0,
					area: '$_id',
					totalUser: 1,
				},
			},
		]);
		return reports;
	}

	async getReportsAccountByPartner(options: IGetReportTotalOptions, userID: string) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					ownerID: Types.ObjectId(userID),
					role: 'student',
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: options.groupType === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d',
							date: '$createdAt',
						},
					},
					totalAccountStudent: {
						$sum: {
							$cond: [{ $eq: ['$role', 'student'] }, 1, 0],
						},
					},
					totalAccountStudentActived: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isActived', true] }] }, 1, 0],
						},
					},
					totalAccountApproved: {
						$sum: {
							$cond: [{ $and: [{ $eq: ['$role', 'student'] }, { $eq: ['$isApproved', true] }] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					date: {
						$dateFromString: {
							dateString: '$_id',
							format: options.groupType === 'hour' ? '%Y-%m-%d %H' : '%Y-%m-%d',
						},
					},
					totalAccountStudent: 1,
					totalAccountStudentActived: 1,
					totalAccountApproved: 1,
				},
			},
			{
				$sort: {
					date: -1,
				},
			},
		]);
		return reports;
	}
	async getReportAccountByYear(year: number, userID: string) {
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					ownerID: Types.ObjectId(userID),
					role: 'student',
				},
			},
			{
				$group: {
					_id: 0,
					january: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '01'] },
									],
								},
								1,
								0,
							],
						},
					},
					febraury: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '02'] },
									],
								},
								1,
								0,
							],
						},
					},
					march: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '03'] },
									],
								},
								1,
								0,
							],
						},
					},
					april: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '04'] },
									],
								},
								1,
								0,
							],
						},
					},
					may: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '05'] },
									],
								},
								1,
								0,
							],
						},
					},
					june: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '06'] },
									],
								},
								1,
								0,
							],
						},
					},
					july: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '07'] },
									],
								},
								1,
								0,
							],
						},
					},
					august: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '08'] },
									],
								},
								1,
								0,
							],
						},
					},
					september: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '09'] },
									],
								},
								1,
								0,
							],
						},
					},
					october: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '10'] },
									],
								},
								1,
								0,
							],
						},
					},
					november: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '11'] },
									],
								},
								1,
								0,
							],
						},
					},
					december: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: [{ $dateToString: { format: '%Y', date: '$createdAt' } }, year] },
										{ $eq: [{ $dateToString: { format: '%m', date: '$createdAt' } }, '12'] },
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					january: 1,
					febraury: 1,
					march: 1,
					april: 1,
					may: 1,
					june: 1,
					july: 1,
					august: 1,
					september: 1,
					october: 1,
					november: 1,
					december: 1,
				},
			},
		]);
		return reports
			? reports[0]
			: {
					january: 1,
					febraury: 1,
					march: 1,
					april: 1,
					may: 1,
					june: 1,
					july: 1,
					august: 1,
					september: 1,
					october: 1,
					november: 1,
					december: 1,
			  };
	}
	async getReportAccountOfPartnerByArea(options: IGetReportTotalOptions, userID: string) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					ownerID: Types.ObjectId(userID),
					role: 'student',
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: '$country',
					totalStudent: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: 0,
					area: '$_id',
					totalStudent: 1,
				},
			},
		]);
		return reports;
	}

	async getReportRankPartnerByAccount(options: IGetReportTotalOptions) {
		const fromDate =
			options.groupType === 'hour'
				? moment(options.from).toDate()
				: moment(options.from)
						.startOf('day')
						.toDate();

		const toDate =
			options.groupType === 'hour'
				? moment(options.to).toDate()
				: moment(options.to)
						.endOf('date')
						.toDate();
		const reports = await AccountModel.aggregate([
			{
				$match: {
					isDeleted: false,
					role: 'student',
					$and: [
						{
							createdAt: {
								...(options.from
									? {
											$gte: fromDate,
									  }
									: { $ne: null }),
							},
						},
						{
							createdAt: {
								...(options.to
									? {
											$lte: toDate,
									  }
									: { $ne: null }),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: '$ownerID',
					totalAccount: {
						$sum: 1,
					},
				},
			},
			{
				$lookup: {
					from: 'accounts',
					localField: '$ownerID',
					foreignField: '_id',
					as: 'partner',
				},
			},
			{
				$project: {
					_id: 0,
					partner: '$partner',
					totalAccount: 1,
				},
			},
		]);
		return reports;
	}
}

export default AccountRepository;
