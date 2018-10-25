import { ConfigModule } from '../DingTalkConfig'
import Http from '../utils/Http'
import { suitStorage } from '../storage'
const { config } = ConfigModule

export class DingTalkIsvApi {

  http = new Http({
    baseUrl: 'https://oapi.dingtalk.com'
  })

  // constructor() {
  //   DingTalkModules.logger('DingTalkIsvApi Init by:')
  //   DingTalkModules.logger(Object.keys(Config).map(k => `${k}=${Config[k]}`).join(' '))
  // }
  
  async updateLocalSuitAccessToken() {
    return;
  }

  // 获取套件 token
  getSuitAccessToken(suitTicket: string) {
    if (!suitTicket) {
      return
    }
    return this.http.post('/service/get_suite_token', {
      suite_key: config.suitKey,
      suite_secret: config.suitSecret,
      suite_ticket: suitTicket
    })
  }

  // 获取公司的永久授权码 需保存到数据库
  async getPermanentCode(tmpAuthCode: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/get_permanent_code?suite_access_token=${suitAccessToken}`, {
      tmp_auth_code: tmpAuthCode
    })
  }
  
  // 企业的授权凭证
  async getCorporationToken(corpId: string, permanentCode: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    // const suitAccessToken = await DingTalkModules.cache.get('suitAccessToken')
    return await this.http.post(`/service/get_corp_token?suite_access_token=${suitAccessToken}`, {
      auth_corpid: corpId,
      permanent_code: permanentCode
    })
  }

  // 获取企业的授权数据详情
  async getAuthInfo(corpId: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/get_auth_info?suite_access_token=${suitAccessToken}`, {
      auth_corpid: corpId,
      suite_key: config.suitKey
    })
  }
  
  // 获取为某个公司开通的应用的信息
  async getAgent(corpId: string, permanentCode: string, agentId: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/get_agent?suite_access_token=${suitAccessToken}`, {
      suite_key: config.suitKey,
      auth_corpid: corpId,
      permanent_code: permanentCode,
      agentid: agentId
    })
  }
  
  // 为某个公司激活套件。如果ISV未调用此接口，则企业用户无法使用ISV套件
  async activateSuit(corpId: string, permanentCode: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/activate_suite?suite_access_token=${suitAccessToken}`, {
      suite_key: config.suitKey,
      auth_corpid: corpId,
      permanent_code: permanentCode
    })
  }
  
  // 该API适用于当企业用户授权开通套件不成功,作为补偿机制调用。该API限制调用频次为1/60s。
  async getUnactiveCorp(agentId: string) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/get_unactive_corp?suite_access_token=${suitAccessToken}`, {
      app_id: agentId
    })
  }
  
  // 该API适用于当企业用户授权开通套件不成功,作为补偿机制调用。该API限制调用频次为1/60s。
  async reauthCorp(agentId: string, corpList: Array<string>) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/reauth_corp?suite_access_token=${suitAccessToken}`, {
      app_id: agentId,
      corpid_list: corpList
    })
  }
  
  // 该API用于ISV为企业独立部署场景，在ISV为企业进行独立部署软件系统时，由于是独立机房环境，每套系统是不同的IP地址
  // ISV可以通过此API为授权套件企业设置IP白名单,设置成功后，套件中的微应用可以调用钉钉开放平台接口服务。
  async setCorpWhitelist(corpId: string, IPWhiteList: Array<string>) {
    await this.updateLocalSuitAccessToken();
    const suitAccessToken = suitStorage.suitAccessToken
    return await this.http.post(`/service/set_corp_ipwhitelist?suite_access_token=${suitAccessToken}`, {
      auth_corpid: corpId,
      ip_whitelist: IPWhiteList
    })
  }

  // 企业在使用微应用中的JS API时，需要先从钉钉开放平台接口获取jsapi_ticket生成签名数据
  // 并将最终签名用的部分字段及签名结果返回到H5中，JS API底层将通过这些数据判断H5是否有权限使用JS API。
  getJSTicket(corpAccessToken: string) {
    return this.http.get('/get_jsapi_ticket', {
      access_token: corpAccessToken,
      type: 'jsapi'
    })
  }

  getUserInfo(corpAccessToken: string, code: string) {
    return this.http.get('/user/getuserinfo', {
      code,
      access_token: corpAccessToken
    })
  }
}
