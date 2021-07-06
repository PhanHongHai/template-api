import express from 'express';
import { validatorBody, validatorParam, validatorQuery } from '../../middlewares';
import AccountController from './account.controller';
import AccountAnalysisController from './account.analysis.controller';

// Validator Schemas
import {
	GetListValidatorSchemas,
	IdMongoValidatorSchemas,
	GetReportValidatorSchemas,
} from '../../common/validatorSchemas';
import {
	CreateAccountAdminValidatorSchema,
	CreateAccountPartnerValidatorSchema,
	CreateAccountStudentValidatorSchema,
	CreateAccountTeacherValidatorSchema,
	CreateAccountEmploymentValidatorSchema,
} from './validatorSchemas/account.create.validatorSchemas';
import { UpdateAccountValidatorSchema } from './validatorSchemas/account.update.validatorSchemas';
import { AuthPasswordValidatorSchemas } from './validatorSchemas/account.authPassword.validatorSchema';
import { authorize } from '../../middlewares/authorize';

const accountController = new AccountController();
const accountAnalysisController = new AccountAnalysisController();
var router = express.Router();

router.use(authorize(['admin', 'employment', 'partner', 'teacher']));

// Get for admin
router
	.route('/')
	// get accounts
	.get(validatorQuery(GetListValidatorSchemas), accountController.getAndSearchAccount);
// analysis
router.get('/reportsTotalsDashboard', accountAnalysisController.reportsTotalsDashboardAdmin);
router.get(
	'/reportsTotals',
	validatorQuery(GetReportValidatorSchemas),
	accountAnalysisController.reportsTotalsAccountByGroup,
);
router.get('/reportRankPartner', accountAnalysisController.reportRankPartnerByAccount);
router.get('/reportTotalsSex', accountAnalysisController.reportTotalSex);
router.get('/reportAreaUser', accountAnalysisController.reportAreaAccount);
router.get(
	'/analysisAccount',
	validatorQuery(GetReportValidatorSchemas),
	accountAnalysisController.reportsCreateAccountDates,
);
router.get('/reportsCreateAccountDates', accountAnalysisController.reportsCreateAccountDates);
router.get('/reportAccountStudentByDatesOfPartner', accountAnalysisController.reportAccountByGroupOfPartner);
router.get('/reportAccountStudentByYearOfPartner', accountAnalysisController.reportAccountByYearOfPartner);
router.get('/reportAccountStudentByAreaOfPartner', accountAnalysisController.reportAccountByAreaOfPartner);
router.get('/partner', accountController.getAccountByOwnerID);
router.get(
	'/searchAccountNonClass',
	validatorQuery(GetListValidatorSchemas),
	accountController.getAndSearchAccountNonClass,
);
router.get(
	'/searchAccountNotApprove',
	validatorQuery(GetListValidatorSchemas),
	accountController.getAndSearchAccountNotApprove,
);
router.post('/auth-account', validatorBody(AuthPasswordValidatorSchemas), accountController.authAccount);
router
	.route('/:ID')
	// get accountByID
	.get(validatorParam(IdMongoValidatorSchemas), accountController.getAccountByID)
	// update account
	.patch(
		validatorBody(UpdateAccountValidatorSchema),
		validatorParam(IdMongoValidatorSchemas),
		accountController.updateAccountByAdmin,
	)
	// remove account
	.delete(validatorParam(IdMongoValidatorSchemas), accountController.deleteAccount);
// Create account admin
router.post('/admin', validatorBody(CreateAccountAdminValidatorSchema), accountController.createAccountAdmin);
// Create account teacher
router.post('/teacher', validatorBody(CreateAccountTeacherValidatorSchema), accountController.createAccountNormal);
// Create account student
router.post('/student', validatorBody(CreateAccountStudentValidatorSchema), accountController.createAccountStudent);
// Create account partner
router.post('/partner', validatorBody(CreateAccountPartnerValidatorSchema), accountController.createAccountNormal);
// Create account partner
router.post(
	'/employment',
	validatorBody(CreateAccountEmploymentValidatorSchema),
	accountController.createAccountNormal,
);
// get accounts by OwnerID

export default router;
