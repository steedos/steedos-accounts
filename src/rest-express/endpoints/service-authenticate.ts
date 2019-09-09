import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { setAuthCookies, hashStampedToken } from '../utils/steedos-auth';
const Cookies = require('cookies');

export const serviceAuthenticate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const serviceName = req.params.service;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const email = req.body.user.email
    if(email.indexOf("@") < 0){
      req.body.user.username = email
    }
    const loggedInUser: any = await accountsServer.loginWithService(serviceName, req.body, {
      ip,
      userAgent,
    });

    //获取user session
    let session:any = await accountsServer.findSessionByAccessToken(loggedInUser.tokens.accessToken)
    
    let services: any = accountsServer.getServices()
    let db = services[serviceName].db

    //确认用户密码是否过期
    let user = await db.collection.findOne({_id: session.userId}, {fields: {password_expired: 1}})

    if(user.password_expired){
      loggedInUser.password_expired = true
    }else{
      //创建Meteor token
      let authToken = null;
      let stampedAuthToken = {
        token: session.token,
        when: new Date
      };
      authToken = stampedAuthToken.token;
      let hashedToken = hashStampedToken(stampedAuthToken);
      let _user = await db.collection.findOne({_id: session.userId}, { fields: ['services'] })
      if (!_user['services']['resume']) {
        _user['services']['resume'] = {loginTokens: []}
      }
      _user['services']['resume']['loginTokens'].push(hashedToken)
      let data = { services: _user['services'] }
      await db.collection.update({_id: session.userId}, {$set: data});
      // 设置cookies
      setAuthCookies(req, res, session.userId, authToken, loggedInUser.tokens.accessToken, null);
    }
    res.json(loggedInUser);
  } catch (err) {
    sendError(res, err);
  }
};
