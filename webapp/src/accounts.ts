import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';

let accountsApiHost = 'http://192.168.3.2:8821'
if (process.env.NODE_ENV == 'production') {
  accountsApiHost = document.location.protocol + "//" + document.location.host
}

const accountsRest = new RestClient({
  apiHost: accountsApiHost,
  rootPath: '/accounts/api',
});
const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsRest, accountsPassword, accountsApiHost };
