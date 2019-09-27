import OAuth2Server = require("oauth2-server");
import {getRepository} from "typeorm";
import {Client} from "./client";
import {User, User as UserEntity} from "./user";
import {AccessToken} from "./access-token";
import {db} from "../db";

export const oauth2Model = {

    getClient: async (clientId: string, clientSecret: string): Promise<Client | '' | 0 | false | null | undefined> => {
        const clients = await db.find("connected_apps", {
            filters: [["client_id", "=", clientId], ["client_secret", "=", clientSecret]],
            fields: ["client_id", "oauth2_scopes", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]
        })

        if (clients.length == 1) {
            return Promise.resolve({
                id: clientId,
                grants: clients[0].oauth2_scopes,
                accessTokenLifetime: 2*60*60, // 2 hours
                refreshTokenLifetime: 30*24*60*60, // 30 days
            });
        }
        
        return Promise.reject("The combination of client id and client secret are incorrect");
    },
    
    saveToken: async (token: AccessToken, client: Client, user: User): Promise<AccessToken | '' | 0 | false | null | undefined> => {
        token.client = client;
        token.clientId = client.id;
        token.user = user;
        token.userId = user.id;
        token.createdFrom = '';
        let bearer = await getRepository(AccessToken).save(token);
        if (!bearer) {
            return Promise.reject("Unable to create the token");
        }
        return Promise.resolve(bearer);
    },

    getAccessToken: async (accessToken: string): Promise<AccessToken> => {
        let token: AccessToken = await getRepository(AccessToken)
            .createQueryBuilder('at')
            .where('at.access_token = :accessToken', {accessToken: accessToken}).getOne();
        if (!token) {
            return Promise.reject("Token not found");
        }
        return Promise.resolve(token);
    },

    verifyScope: async (token: OAuth2Server.Token, scope: string): Promise<boolean> => {
        return true;
    },

    getUser: async (email: string, password: string): Promise<User | '' | 0 | false | null | undefined> => {
        let user: UserEntity = await getRepository(UserEntity).createQueryBuilder('u').where('u.email = :email AND u.password = :password', {
            email: email,
            password: password
        }).getOne();
        if (!user) {
            return Promise.reject("User not found");
        }
        return Promise.resolve(user);
    }
};