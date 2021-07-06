import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../common/error/index';
import { FailureRespone } from '../common/respone';
import { getMessages } from '../common/messages/index';
import AccountRepository from '../modules/accounts/account.repository';

const message = getMessages('account','vi');
const accountRepository = new AccountRepository();

export const authorize = (roles: string[] = []) => {
    return async (req: any, res: any, next: Function) => {
      try {
        const { accesstoken } = req.headers; 
        if (!accesstoken) {
          throw new UnauthorizedException(message.LOGIN_IS_INVALID);
        }
        let secret: any = process.env.SECRET_SIGN_TOKEN ? process.env.SECRET_SIGN_TOKEN : 'no_secret';     
        let payload: any =await jwt.verify(accesstoken, secret);
        
        if (!payload || !payload.userID)
          throw new UnauthorizedException(message.LOGIN_IS_INVALID);
        const user = await accountRepository.getById(payload.userID,{},'-password');      
        if (!user) {
          throw new UnauthorizedException(message.LOGIN_IS_INVALID);
        }
         if ((roles.length > 0) && (!roles.find((item) => item === user.role))) {
           throw new UnauthorizedException(message.FEATURE_CANNOT_ACCESS);
        }
        req.userID = payload.userID;
        req.role = payload.role;
        next();
      } catch (err) {
        if (err.message == 'Không được phép sử dụng tính năng này') {
          return FailureRespone(res, err);
        } else {
          return FailureRespone(res, new UnauthorizedException(message.LOGIN_IS_INVALID));
        }
      }
    }
  } 