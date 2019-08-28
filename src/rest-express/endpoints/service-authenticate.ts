import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';
import { userLoader } from '../user-loader';
import { auth, getSession, utils } from '@steedos/auth';

export const serviceAuthenticate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const serviceName = req.params.service;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const loggedInUser = await accountsServer.loginWithService(serviceName, req.body, {
      ip,
      userAgent,
    });
    
    console.log('================loggedInUser end=================');

    //创建Meteor token： 待优化
    let user:any = await accountsServer.resumeSession(loggedInUser.tokens.accessToken)
    let authtToken = null;
    let stampedAuthToken = utils._generateStampedLoginToken();
    authtToken = stampedAuthToken.token;
    let hashedToken = utils._hashStampedToken(stampedAuthToken);

    let services: any = accountsServer.getServices()
    let db = services[serviceName].db
    let _user = await db.collection.findOne({_id: user._id}, { fields: ['services'] })

    _user['services']['resume']['loginTokens'].push(hashedToken)
    let data = { services: _user['services'] }
    await db.collection.update({_id: user._id}, {$set: data});

    console.log('_user', _user);

    //设置cookies
    utils._setAuthCookies(req, res, user._id, authtToken);

    res.json(loggedInUser);
  } catch (err) {
    sendError(res, err);
  }
};
