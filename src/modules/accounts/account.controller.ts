import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
const bcrypt = require('bcryptjs');
import BaseController from '../../common/base/controller.base';
import AccountRepository from './account.repository';
// error
import {
	UnauthorizedException,
	BadRequestException,
	NotFoundException,
	InternalServerErrorException,
} from '../../common/error';
// interfaces
import {
	ICreateAccount,
	IUpdateAccount,
	IChangePassword,
	IResetPassword,
	ICreateStudentAccount,
} from './account.interface';
// message
import { getMessages } from '../../common/messages/index';
import { SendMail, verifyAccountOptions } from '../../helpers/sendMail.helper';
import ClassDetailRepository from '../classDetail/classDetail.repository';
import ProFileRepository from '../proFiles/proFile.repository';
import { uploadSingle } from './../upload/upload.services';
import moment from 'moment';

const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
class AccountController extends BaseController {
	accountRepository: AccountRepository;
	classDetailRepository: ClassDetailRepository;
	proFileRepository: ProFileRepository;
	messges = getMessages('account', 'vi');
	constructor() {
		super();
		this.accountRepository = new AccountRepository();
		this.classDetailRepository = new ClassDetailRepository();
		this.proFileRepository = new ProFileRepository();
	}

	/**
	 * Get applications list
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAndSearchAccount(req: any, res: any, next: any) {
		try {
			let { limit, page, type, isInClass, keyword } = req.query;
			let { userID } = req;
			let account;
			if (!type && !isInClass) {
				account = await this.accountRepository.search(
					keyword,
					{ role: { $ne: 'admin' }, _id: { $ne: userID } },
					limit,
					page,
				);
			}
			if (type && !isInClass) {
				account = await this.accountRepository.search(
					keyword,
					{ role: { $ne: 'admin', $eq: type }, _id: { $ne: userID } },
					limit,
					page,
				);
			}
			if (type && isInClass) {
				account = await this.accountRepository.search(
					keyword,
					{ role: { $ne: 'admin', $eq: type }, _id: { $ne: userID }, isInClass: { $in: isInClass } },
					limit,
					page,
				);
			}

			res.json(account);
		} catch (error) {
			next(error);
		}
	}

	async getAndSearchAccountNonClass(req: any, res: any, next: any) {
		try {
			let { limit, page, type, keyword } = req.query;
			let account = await this.accountRepository.search(
				keyword,
				{ role: { $ne: 'admin', $eq: type }, isApproved: true, isInClass: false },
				limit,
				page,
			);
			res.json(account);
		} catch (error) {
			next(error);
		}
	}

	async getAndSearchAccountNotApprove(req: any, res: any, next: any) {
		try {
			let { limit, page, type, keyword } = req.query;
			let account = await this.accountRepository.search(
				keyword,
				{ role: { $ne: 'admin', $eq: type }, isInClass: false, isApproved: false },
				limit,
				page,
			);
			res.json(account);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Get detail account
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAccountByID(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const appData = await this.accountRepository.getById(ID, {}, '-password');
			if (!appData) {
				throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			} else res.json(appData);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Get get students by partner data
	 * @param req
	 * @param res
	 * @param next
	 */
	async getAccountByOwnerID(req: any, res: any, next: any) {
		try {
			const { userID } = req;
			const { limit, page, keyword } = req.query;
			const students = await this.accountRepository.getManyByOwnerID({ ownerID: userID }, limit, page, keyword);

			if (!students) {
				throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			} else res.json(students);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * login
	 * @param req
	 * @param res
	 * @param next
	 */
	async login(req: any, res: any, next: any) {
		try {
			const { email, password } = req.body;
			const userData = await this.accountRepository.getAccountByOption({ email: email });
			if (!userData) {
				throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			}
			if (userData && !userData.isActived) {
				res.json({ isActived: userData.isActived });
			}
			if (userData && userData.isActived) {
				if (bcrypt.compareSync(password, userData.password)) {
					let token = jwt.sign({ role: userData.role, userID: userData._id }, process.env.SECRET_SIGN_TOKEN);
					res.json({ token, role: userData.role });
				} else throw new BadRequestException(this.messges.PASSWORD_IS_NOT_CORRECT);
			}
		} catch (error) {
			next(error);
		}
	}
	async loginStudent(req: any, res: any, next: any) {
		try {
			const { tag, password } = req.body;
			const userData = await this.accountRepository.getAccountByOption({ tag });
			if (!userData) {
				throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			}
			if (bcrypt.compareSync(password, userData.password)) {
				let token = jwt.sign({ role: userData.role, userID: userData._id }, process.env.SECRET_SIGN_TOKEN);
				res.json({ token, role: userData.role });
			} else throw new BadRequestException(this.messges.PASSWORD_IS_NOT_CORRECT);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * auth password
	 * @param req
	 * @param res
	 * @param next
	 */
	async authAccount(req: any, res: any, next: any) {
		try {
			const { password } = req.body;
			const { userID } = req;

			const userData = await this.accountRepository.getAccountByOption({ _id: userID });
			if (!userData) {
				throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			}
			if (bcrypt.compareSync(password, userData.password)) {
				res.json(true);
			} else throw new BadRequestException(this.messges.PASSWORD_IS_NOT_CORRECT);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * get data account by userID
	 * @param req
	 * @param res
	 * @param next
	 */
	async getProfile(req: any, res: any, next: any) {
		try {
			const { userID } = req;
			let userData = await this.accountRepository.getById(userID, {}, '-password');
			if (!userData) throw new NotFoundException(this.messges.ACCOUNT_IS_NOT_FOUND);
			res.json(userData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * check account was actived
	 * @param req
	 * @param res
	 * @param next
	 */
	async checkActivedAccount(req: any, res: any, next: any) {
		try {
			const { verifyToken } = req.params;
			let userData = await this.accountRepository.findAccountByVerifyToken(verifyToken);
			if (!userData) res.json({ nonActive: true });
			else res.json({ nonActive: false });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * resend verify mail
	 * @param req
	 * @param res
	 * @param next
	 */
	async resendVerifyMail(req: any, res: any, next: any) {
		try {
			let { email } = req.body;
			let userData = await this.accountRepository.getAccountByOption({ email: email });
			if (!userData) throw new NotFoundException(this.messges.NOT_FOUND_USER);
			if (userData && !userData.isActived) {
				let tokenActive = uuidv4();
				let checkUpdate = await this.accountRepository.update(userData._id, {
					verifyToken: tokenActive,
				});
				if (checkUpdate)
					SendMail(
						verifyAccountOptions({
							email,
							title: 'Đào tạo từ xa: Xác thực tài khoản',
							content: `Xác thực tài khoản tại ${process.env.HOST_CLIENT}/active/${tokenActive}`,
						}),
					)
						.then(success => {
							res.json({ isResend: true });
						})
						.catch(err => {
							if (err) throw new InternalServerErrorException(this.messges.ERROR_SEND_EMAIL);
						});
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * active account
	 * @param req
	 * @param res
	 * @param next
	 */
	async activedAccount(req: any, res: any, next: any) {
		try {
			const { verifyToken } = req.params;
			let userData = await this.accountRepository.findAccountByVerifyToken(verifyToken);
			if (userData && !userData.isActived) {
				let checkUpdate = await this.accountRepository.update(userData._id, {
					isActived: true,
					tokenVerify: '',
				});
				if (checkUpdate) res.json({ isActived: true });
			} else res.json({ nonActive: true });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Create account admin
	 * @param req
	 * @param res
	 * @param next
	 */

	async createAccountAdmin(req: any, res: any, next: any) {
		try {
			const data: ICreateAccount = req.body;
			if (data.role !== 'admin') {
				throw new BadRequestException(this.messges.CREATE_ACCOUNT_ADMIN);
			}
			if (data.role === 'admin') {
				let rolelExist = await this.accountRepository.getAccountSuperAdmin();
				if (rolelExist) throw new BadRequestException(this.messges.ADMIN_IS_EXIST);
			}
			if (data.email) {
				let emailExist = await this.accountRepository.getAccountByOption({ email: data.email });
				if (emailExist) throw new BadRequestException(this.messges.EMAIL_IS_EXIST);
			}
			if (data.phoneNumber) {
				let mobilePhoneExist = await this.accountRepository.getAccountByOption({ phoneNumber: data.phoneNumber });
				if (mobilePhoneExist) throw new BadRequestException(this.messges.PHONE_IS_EXIST);
			}
			// if (data.idCard) {
			// 	let idCardExist = await this.accountRepository.getAccountByOption({ idCard: data.idCard });
			// 	if (idCardExist) throw new BadRequestException(this.messges.IDCARD_IS_EXIST);
			// }
			let create = await this.accountRepository.create(data);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Create account by role
	 * @param req
	 * @param res
	 * @param next
	 */
	async createAccountNormal(req: any, res: any, next: any) {
		try {
			const dataBody: ICreateAccount = req.body;
			const { userID } = req;
			let userData = await this.accountRepository.getById(userID, {}, '-password');
			if (!userData) throw new UnauthorizedException(this.messges.CANNOT_ACCESS);
			if (userData && userData.role === 'partner' && dataBody.role === 'student') {
				dataBody.ownerID = userID;
				dataBody.isApproved = false;
			}
			if (dataBody.role === 'admin') {
				throw new BadRequestException(this.messges.CREATE_ACCOUNT_NORMAL);
			}
			if (dataBody.email) {
				let emailExist = await this.accountRepository.getAccountByOption({ email: dataBody.phoneNumber });
				if (emailExist) throw new BadRequestException(this.messges.EMAIL_IS_EXIST);
			}
			if (dataBody.phoneNumber) {
				let mobilePhoneExist = await this.accountRepository.getAccountByOption({ phoneNumber: dataBody.phoneNumber });
				if (mobilePhoneExist) throw new BadRequestException(this.messges.PHONE_IS_EXIST);
			}
			if (dataBody.idCard) {
				let idCardExist = await this.accountRepository.getAccountByOption({ idCard: dataBody.idCard });
				if (idCardExist) throw new BadRequestException(this.messges.IDCARD_IS_EXIST);
			}
			dataBody.tokenVerify = uuidv4();
			let create = await this.accountRepository.create(dataBody);
			// SendMail(
			// 	verifyAccountOptions({
			// 		email: dataBody.email,
			// 		title: 'Đào tạo từ xa: Kích hoạt tài khoản',
			// 		content: `Xác thực tài khoản tại ${process.env.HOST_CLIENT}/active/${dataBody.tokenVerify}`,
			// 	}),
			// )
			// 	.then(success => {
			// 		res.json(create);
			// 	})
			// 	.catch(err => {
			// 		throw new InternalServerErrorException(this.messges.ERROR_SEND_EMAIL);
			// 	});
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Create account student
	 * @param req
	 * @param res
	 * @param next
	 */
	async createAccountStudent(req: any, res: any, next: any) {
		try {
			const dataBody: ICreateStudentAccount = req.body;
			const { userID } = req;
			let countAccountStudent = await this.accountRepository.getCountAll({ role: 'student' });
			let userData = await this.accountRepository.getById(userID, {}, '-password');
			if (!userData) throw new UnauthorizedException(this.messges.CANNOT_ACCESS);
			if (userData && userData.role === 'partner' && dataBody.role === 'student') {
				dataBody.ownerID = userID;
				dataBody.isApproved = false;
			}
			if (dataBody.role === 'admin') {
				throw new BadRequestException(this.messges.CREATE_ACCOUNT_NORMAL);
			}
			if (dataBody.phoneNumber) {
				let mobilePhoneExist = await this.accountRepository.getAccountByOption({ phoneNumber: dataBody.phoneNumber });
				if (mobilePhoneExist) throw new BadRequestException(this.messges.PHONE_IS_EXIST);
			}
			if (dataBody.idCard) {
				let idCardExist = await this.accountRepository.getAccountByOption({ idCard: dataBody.idCard });
				if (idCardExist) throw new BadRequestException(this.messges.IDCARD_IS_EXIST);
			}
			let sttAccount = countAccountStudent + 1;
			dataBody.tag = moment().year() + '' + sttAccount;
			dataBody.password = moment(dataBody.birthDay).format('DDMMYYYY');
			let create = await this.accountRepository.create(dataBody);
			res.json(create);
		} catch (error) {
			next(error);
		}
	}
	/**
	 * upload avatar
	 * @param req
	 * @param res
	 * @param next
	 */
	async uploadFile(req: any, res: any, next: any) {
		try {
			let file: any = await uploadSingle(req, res, 'file', 'image');
			if (!file) throw new BadRequestException(this.messges.NO_FILE_SELECTED);
			res.json({ path: file.path, url: `uploads/images/${file.filename}` });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update account by admin
	 * @param req
	 * @param res
	 * @param next
	 */
	async updateAccountByAdmin(req: any, res: any, next: any) {
		try {
			let data: IUpdateAccount = req.body;
			const { ID } = req.params;
			const userData = await this.accountRepository.getById(ID, {}, '-password');
			if (!userData) {
				throw new NotFoundException(this.messges.NOT_FOUNT_USER_UPDATE);
			}
			// Check current mobile and mobile input is matching
			if (userData && data.phoneNumber && userData.phoneNumber !== data.phoneNumber) {
				let mobileExist = await this.accountRepository.getAccountByOption({ phoneNumber: data.phoneNumber });
				if (mobileExist) {
					throw new BadRequestException(this.messges.PHONE_IS_EXIST);
				}
			}
			// Check current idCard and mobile input is matching
			if (userData && data.idCard && userData.idCard !== data.idCard) {
				let idCardExist = await this.accountRepository.getAccountByOption({ idCard: data.idCard });
				if (idCardExist) {
					throw new BadRequestException(this.messges.ID_CARD_IS_EXIST);
				}
			}
			// Not get password
			if (data.password) throw new BadRequestException(this.messges.NOT_GET_PASSWORD);
			if (data.email) {
				let verifyToken = uuidv4();
				let isUpdateEmail = await this.accountRepository.update(ID, { ...data, tokenVerify: verifyToken });
				SendMail(
					verifyAccountOptions({
						email: data.email,
						title: 'Đào tạo từ xa: Kích hoạt tài khoản',
						content: `Xác thực tài khoản tại ${process.env.HOST_CLIENT}/active-account/${verifyToken}`,
					}),
				)
					.then(success => {
						res.json({ isUpdated: isUpdateEmail });
					})
					.catch(err => {
						throw new InternalServerErrorException(this.messges.ERROR_SEND_EMAIL);
					});
			} else {
				let isUpdate = await this.accountRepository.update(ID, data);
				res.json({ isUpdated: isUpdate });
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Update account by user
	 * @param req
	 * @param res
	 * @param next
	 */
	async updateAccount(req: any, res: any, next: any) {
		try {
			let data: IUpdateAccount = req.body;
			const { userID } = req;
			const userData = await this.accountRepository.getById(userID, {}, '-password');
			if (!userData) {
				throw new NotFoundException(this.messges.NOT_FOUNT_USER_UPDATE);
			}
			if (userData.role === 'admin' && userData._id != userID)
				throw new UnauthorizedException(this.messges.CANNOT_ACCESS);
			// Check current email and email input is matching
			if (userData && data.email && userData.email !== data.email) {
				let emailExist = await this.accountRepository.getAccountByOption({ email: data.email });
				if (emailExist) throw new BadRequestException(this.messges.EMAIL_IS_EXIST);
			}
			// Check current mobile and mobile input is matching
			if (userData && data.phoneNumber && userData.phoneNumber !== data.phoneNumber) {
				let mobileExist = await this.accountRepository.getAccountByOption({ phoneNumber: data.phoneNumber });
				if (mobileExist) {
					throw new BadRequestException(this.messges.PHONE_IS_EXIST);
				}
			}
			// Check current idCard and mobile input is matching
			if (userData && data.idCard && userData.idCard !== data.idCard) {
				let idCardExist = await this.accountRepository.getAccountByOption({ idCard: data.idCard });
				if (idCardExist) {
					throw new BadRequestException(this.messges.PHONE_IS_EXIST);
				}
			}
			// Not get password
			if (data.password) throw new BadRequestException(this.messges.NOT_GET_PASSWORD);
			if (data.email) {
				let verifyToken = uuidv4();
				let isUpdateEmail = await this.accountRepository.update(userID, { ...data, tokenVerify: verifyToken });
				SendMail(
					verifyAccountOptions({
						email: data.email,
						title: 'Đào tạo từ xa: Kích hoạt tài khoản',
						content: `Xác thực tài khoản tại ${process.env.HOST_CLIENT}/active-account/${verifyToken}`,
					}),
				)
					.then(success => {
						res.json({ isUpdated: isUpdateEmail });
					})
					.catch(err => {
						if (err) throw new InternalServerErrorException(this.messges.ERROR_SEND_EMAIL);
					});
			} else {
				let isUpdate = await this.accountRepository.update(userID, data);
				if (isUpdate && data.avatar && data.pathAvatar && userData.avatar) fs.unlinkSync(userData.pathAvatar);
				res.json({ isUpdated: isUpdate });
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * send mail forgot password
	 * @param req
	 * @param res
	 * @param next
	 */
	async sendForgotPassword(req: any, res: any, next: any) {
		try {
			const { email } = req.body;
			if (!email) throw new BadRequestException(this.messges.EMAIL_IS_REQUIRED);
			let userData = await this.accountRepository.getAccountByOption({ email: email });
			if (!userData) throw new NotFoundException(this.messges.EMAIL_NOT_EXIST);
			if (userData) {
				let randomString = uuidv4();
				let checkUpdate = await this.accountRepository.update(userData._id, {
					tokenChange: randomString,
				});
				if (checkUpdate)
					SendMail(
						verifyAccountOptions({
							email,
							title: 'Đào tạo từ xa: Đổi mật khẩu tài khoản',
							content: `Click vào link kế bên để đổi mật khẩu tài khoản ${process.env.HOST_CLIENT}/reset-password/${randomString}`,
						}),
					)
						.then(success => {
							res.json({ isResend: true });
						})
						.catch(err => {
							if (err) throw new InternalServerErrorException(this.messges.ERROR_SEND_EMAIL);
						});
			}
		} catch (error) {
			next(error);
		}
	}
	/**
	 * update new password
	 * @param req
	 * @param res
	 * @param next
	 */
	async resetPassword(req: any, res: any, next: any) {
		try {
			const data: IResetPassword = req.body;
			let userData = await this.accountRepository.findAccountByChangeToken(data.tokenChange);
			if (!userData) throw new NotFoundException(this.messges.TOKEN_RESET_IS_INVALID);
			if (data.newPassword !== data.confirmPassword)
				throw new BadRequestException(this.messges.PASSWORD_IS_NOT_COMPARE_CONFIRM_PASSWORD);
			const hash = bcrypt.hashSync(data.newPassword, salt);
			let checkUpdate = await this.accountRepository.update(userData._id, {
				password: hash,
				tokenChange: '',
			});
			res.json({ isUpdated: checkUpdate });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * change password
	 * @param req
	 * @param res
	 * @param next
	 */
	async changePassword(req: any, res: any, next: any) {
		try {
			const { userID } = req;
			let data: IChangePassword = req.body;
			const userData = await this.accountRepository.getById(userID, {}, '');
			if (data.oldPassword === data.newPassword) throw new BadRequestException(this.messges.NEW_PASSWORD_IS_INVALID);
			if (!userData) {
				throw new NotFoundException(this.messges.NOT_FOUNT_USER_UPDATE);
			}
			if (!bcrypt.compareSync(data.oldPassword, userData.password)) {
				throw new BadRequestException(this.messges.OLD_PASSWORD_IS_NOT_CORRECT);
			}
			const hash = bcrypt.hashSync(data.newPassword, salt);
			const user = await this.accountRepository.update(userID, { password: hash });
			res.json({
				isUpdated: user,
			});
		} catch (error) {
			next(error);
		}
	}
	/**
	 * Remove account
	 * @param req
	 * @param res
	 * @param next
	 */
	async deleteAccount(req: any, res: any, next: any) {
		try {
			const { ID } = req.params;
			const { role, userID } = req;
			const exisitAccount = await this.accountRepository.getById(ID, {}, '-password');
			if (!exisitAccount) {
				throw new NotFoundException(this.messges.NOT_FOUNT_USER_DELETE);
			}
			if (exisitAccount && userID === exisitAccount._id) {
				throw new BadRequestException(this.messges.CAN_NOT_DELETE_YOUR_ACCOUNT);
			}
			if (exisitAccount && exisitAccount.role === 'admin' && role !== exisitAccount.role) {
				throw new UnauthorizedException(this.messges.CANNOT_ACCESS);
			}
			const isDeleted = await this.accountRepository.delete(ID);
			if (isDeleted) {
				let deleteClassDetail = await this.classDetailRepository.removeMany({ accountID: ID });
				res.json({ isDeleted: deleteClassDetail });
				let deleteProFile = await this.proFileRepository.deleteProFile({ accountID: ID });
				res.json({ isDeleted: deleteProFile });
			}
			res.json(isDeleted);
		} catch (error) {
			next(error);
		}
	}
}

export default AccountController;
