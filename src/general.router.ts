import express from 'express';
import fs from 'fs';
import AccountController from './modules/accounts/account.controller';
import ClassDetailController from './modules/classDetail/classDetail.controller';
import { validatorBody, validatorParam } from './middlewares';
import { authorize } from './middlewares/authorize';
// validate schema
import {
	LoginAccountValidatorSchema,
	LoginAccountStudentValidatorSchema,
} from './modules/accounts/validatorSchemas/account.login.validatorSchemas';
import {
	ResetPasswordValidatorSchema,
} from './modules/accounts/validatorSchemas/account.sendMail.validatorSchemas';


var router = express.Router();

const accountController = new AccountController();

// general route

// login
router.post('/login', validatorBody(LoginAccountValidatorSchema), accountController.login);
router.post('/login-student', validatorBody(LoginAccountStudentValidatorSchema), accountController.loginStudent);

// router.get('/detail-class',authorize(['student']),classDetailController.getInfoClassByStudentID);
// get account data
router.get('/fetch-profile', authorize(), accountController.getProfile);
// send request forgot password
router.post('/resend-forgot-password', accountController.sendForgotPassword);
// update new password
router.patch('/reset-password', validatorBody(ResetPasswordValidatorSchema), accountController.resetPassword);

export default router;
