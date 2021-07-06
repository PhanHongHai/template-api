import express from 'express';
var router = express.Router();


import AccountRouter from './modules/accounts/account.router';



var router = express.Router();

router.use('/accounts', AccountRouter);


export default router;
