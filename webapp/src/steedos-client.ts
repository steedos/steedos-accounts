export class SteedosClient {
    private static getCookie(name: string){
        let pattern = RegExp(name + "=.[^;]*");
        let matched = document.cookie.match(pattern);
        if(matched){
            let cookie = matched[0].split('=')
		    return cookie[1]
        }  
        return false;
    }

    public static async validateToken(){
        console.log('in validateToken...')
        //TODO URL 参数
        let userId = this.getCookie("X-User-Id")
        let authToken = this.getCookie("X-Auth-Token")
        let spaceId = window.localStorage.getItem("spaceId")

        let headers: any = {}
        let requestData = { 'utcOffset': 480 / 60 } // TODO moment().utcOffset()
        if(authToken && spaceId){
            headers['Authorization'] = 'Bearer ' + spaceId + ',' + authToken
        }else if(authToken){
            headers['X-Auth-Token'] = authToken
        }
        
        return await fetch("/api/v4/users/validate", {
            method: 'POST',
            headers: headers,
            ...requestData
        })
    }


    public static async logout(){
        await fetch("/api/setup/logout", {
            method: 'POST'
        })
        this.clearAuthLocalStorage();
    }

    public static clearAuthLocalStorage(){
        let localStorage = window.localStorage;
        let i = 0
        while(i < localStorage.length){
            let key: any = localStorage.key(i)
            if(key.startsWith("Meteor.loginToken") || key.startsWith("Meteor.userId")  || key.startsWith("Meteor.loginTokenExpires")){
                localStorage.removeItem(key)
            }
            i++
        }
    }
}