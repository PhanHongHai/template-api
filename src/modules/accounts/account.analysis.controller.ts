import BaseController from '../../common/base/controller.base';
import AccountRepository from './account.repository';
import moment from 'moment';
import { addMissingHour } from '../../utils/addMissingHour';
import { addMissingDate } from '../../utils/addMissingDate';
import _ from 'lodash';

// error
import { BadRequestException, UnauthorizedException } from '../../common/error';
// interfaces
// message
import { getMessages } from '../../common/messages/index';
// repository
import ClassRepository from '../classes/class.repository';
import SectorRepository from '../trainingSector/TrainingSector.repository';
import SubjectRepository from '../subjects/subject.repository';
import DocumentRepository from '../documents/document.repository';

class AccountAnalysisController extends BaseController {
	accountRepository: AccountRepository;
	classRepository: ClassRepository;
	sectorRepository: SectorRepository;
	subjectRepository: SubjectRepository;
	documentRepository: DocumentRepository;

	messges = getMessages('account', 'vi');
	constructor() {
		super();
		this.accountRepository = new AccountRepository();
		this.classRepository = new ClassRepository();
		this.sectorRepository = new SectorRepository();
		this.subjectRepository = new SubjectRepository();
		this.documentRepository = new DocumentRepository();
	}

	async reportsTotalsDashboardAdmin(req: any, res: any, next: any) {
		try {
			let reports = await this.accountRepository.getReportsTotals();
			let totalClass = await this.classRepository.countNumberClass();
			let totalSubject = await this.subjectRepository.countNumberSubject();
			let totalSector = await this.sectorRepository.countNumberSector();
			let totalLesson = await this.documentRepository.countNumberLesson();
			res.json({ ...reports, totalClass, totalSubject, totalSector, totalLesson });
		} catch (error) {
			next(error);
		}
	}
	async reportsTotalsAccountByGroup(req: any, res: any, next: any) {
		try {
			let reports = await this.accountRepository.getReportsTotalsByGroup(req.query);
			res.json(reports);
		} catch (error) {
			next(error);
		}
	}

	async reportsCreateAccountDates(req: any, res: any, next: any) {
		try {
			const { from, to, groupType } = req.query;
			let reports = await this.accountRepository.reportsAccountActivedDates(req.query);
			if (groupType === 'hour') {
				reports = addMissingHour(from, to, reports, {
					totalAccountStudent: 0,
					totalAccountPartner: 0,
				});
			} else {
				reports = addMissingDate(from, to, reports, {
					totalAccountStudent: 0,
					totalAccountPartner: 0,
				});
			}
			// Sort by date and return the result
			res.json(
				_.sortBy(reports, e => {
					return moment(e.date);
				}),
			);
		} catch (error) {
			next(error);
		}
	}
	async reportTotalSex(req: any, res: any, next: any) {
		try {
			const { type } = req.query;
			if (!type) throw new BadRequestException(this.messges.TYPE_ACCOUNT_IS_REQUIRED);
			let totalMale = await this.accountRepository.getCount({ role: type, sex: 1 });
			let totalFeMale = await this.accountRepository.getCount({ role: type, sex: 2 });
			res.json({ totalFeMale, totalMale });
		} catch (error) {
			next(error);
		}
	}
	async reportAreaAccount(req: any, res: any, next: any) {
		try {
			const { type } = req.query;
			if (!type) throw new BadRequestException(this.messges.TYPE_ACCOUNT_IS_REQUIRED);
			let report = await this.accountRepository.reportsUserAreas(type);
			res.json(report);
		} catch (error) {
			next(error);
		}
	}
	async reportAccountByGroupOfPartner(req: any, res: any, next: any) {
		try {
			const { userID, role } = req;
			const { groupType, from, to } = req.query;
			let checkAccount = await this.accountRepository.getAccountByOption({ _id: userID, role });
			if (!checkAccount) throw new UnauthorizedException(this.messges.ACCOUNT_WITHOUT_ACCESS);
			let reports = await this.accountRepository.getReportsAccountByPartner(req.query, userID);
			if (groupType === 'hour') {
				reports = addMissingHour(from, to, reports, {
					totalAccountStudent: 0,
					totalAccountStudentActived: 0,
					totalAccountApproved: 0,
				});
			} else {
				reports = addMissingDate(from, to, reports, {
					totalAccountStudent: 0,
					totalAccountStudentActived: 0,
					totalAccountApproved: 0,
				});
			}
			// Sort by date and return the result
			res.json(
				_.sortBy(reports, e => {
					return moment(e.date);
				}),
			);
			res.json(reports);
		} catch (error) {
			next(error);
		}
	}
	async reportAccountByYearOfPartner(req: any, res: any, next: any) {
		try {
			const { userID, role } = req;
			const { year } = req.query;
			let checkAccount = await this.accountRepository.getAccountByOption({ _id: userID, role });
			if (!checkAccount) throw new UnauthorizedException(this.messges.ACCOUNT_WITHOUT_ACCESS);
			let reports = await this.accountRepository.getReportAccountByYear(year, userID);
			res.json(reports);
		} catch (error) {
			next(error);
		}
	}
	async reportAccountByAreaOfPartner(req: any, res: any, next: any) {
		try {
			const { userID, role } = req;
			let checkAccount = await this.accountRepository.getAccountByOption({ _id: userID, role });
			if (!checkAccount) throw new UnauthorizedException(this.messges.ACCOUNT_WITHOUT_ACCESS);
			let reports = await this.accountRepository.getReportAccountOfPartnerByArea(req.query, userID);
			res.json(reports);
		} catch (error) {
			next(error);
		}
	}

	async reportRankPartnerByAccount(req: any, res: any, next: any) {
		try {
			let reports = await this.accountRepository.getReportRankPartnerByAccount(req.query);
			res.json(reports);
		} catch (error) {
			next(error);
		}
	}
}
export default AccountAnalysisController;
