import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../db';
import * as _ from 'lodash';

const config = getSteedosConfig();

export const getSettings = async ()=>{
    let tenant = {
        name: "Steedos",
        logo_url: undefined,
        background_url: undefined,
        enable_create_tenant: true,
        enable_register: true,
        enable_forget_password: true
      }
      if (config.tenant && config.tenant._id) {
        let spaceDoc = await db.findOne("spaces", config.tenant._id, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})
    
        if (config.webservices && config.webservices.steedos) {
          if (!config.webservices.steedos.endsWith("/"))
            config.webservices.steedos += "/"
          
            _.assignIn(tenant, spaceDoc);
          if (spaceDoc.avatar_dark) {
            tenant.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar_dark
          } else if (spaceDoc.avatar) {
            tenant.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar
          } 
          if (spaceDoc.background) {
            tenant.background_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.background
          }
        }
      } else if (config.tenant) {
          _.assignIn(tenant, config.tenant)
      }

      return {
        tenant: tenant,
        password: config.password?config.password:{},
        root_url: process.env.ROOT_URL
      }
}

export const getTenant = async (spaceId)=>{
    if (!spaceId){
        return {};
    }
    
    const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})

    if(!spaceDoc){
      return {}
    }

    if (config.webservices && config.webservices.steedos) {
      if (!config.webservices.steedos.endsWith("/"))
        config.webservices.steedos += "/"
      if (spaceDoc.avatar_dark) {
        spaceDoc.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar_dark
      } else if (spaceDoc.avatar) {
        spaceDoc.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar
      } 
      if (spaceDoc.background) {
        spaceDoc.background_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.background
      }
    }

    return spaceDoc;
}

export const spaceExists = async(spaceId)=>{
  const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})
  if(spaceDoc){
    return true;
  }
  return false;
}

export const getMergedTenant = async (spaceId?)=>{
    const settings: any = await getSettings();
    const tenant: any = await getTenant(spaceId);
    return Object.assign({}, settings.tenant, tenant);
}

export const canRegister = async (spaceId, action)=>{
    const tenant: any = await getMergedTenant(spaceId);
    if(action === 'emailSignupAccount' && (tenant.enable_bind_mobile === true || tenant.enable_bind_email != true)){
      return false
    }else if(action === 'mobileSignupAccount' && tenant.enable_bind_mobile != true){
      return false
    }else if(action === 'withPassword'){
      return tenant.enable_register && !tenant.enable_bind_mobile && !tenant.enable_bind_email
    }
    return tenant.enable_register;
}

export const canPasswordLogin = async ()=>{
  const tenant: any = await getMergedTenant();
  return tenant.enable_password_login;
}

export const canMobilePasswordLogin = async (user)=>{
  const tenant: any = await getMergedTenant();
  if(tenant.enable_bind_mobile){
    return user.mobile_verified
  }
  return tenant.enable_password_login;
}

export const canEmailPasswordLogin = async (user)=>{
  const tenant: any = await getMergedTenant();
  if(tenant.enable_bind_email){
    return user.email_verified
  }
  return tenant.enable_password_login;
}

export const canSendEmail = () => {
  const config = getSteedosConfig().email || {};
  let canSend = true;
  if (!config) {
    canSend = false;
  }
  if (!config) {
    console.log("Please set email configs in steedos-config.yml")
    canSend = false;
  }
  if (!config.from) {
    console.log("Please set email configs in steedos-config.yml")
    canSend = false;
  }
  if (!config.url && (!config.host || !config.port || !config.username || !config.password)) {
    console.log("Please set email configs in steedos-config.yml")
    canSend = false;
  }
  return canSend
}