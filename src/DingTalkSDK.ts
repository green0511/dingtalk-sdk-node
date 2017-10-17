import { DingTalkConfig, ConfigModule } from './DingTalkConfig'
import encryptor, { DingTalkEncryptor } from './encryptor/index'
import isv, { DingTalkIsvApi }  from './isv/index'

import { DingTalkCache, DingTalkLogger, DingTalkModuleOption } from './DingTalkModules'
import DingTalkModules from './DingTalkModules'

export default class DingTalkSDK {

  encryptor: DingTalkEncryptor = encryptor
  isv: DingTalkIsvApi = isv

  public config(config: DingTalkConfig) {
    ConfigModule.updateConfig(config);
  }

  constructor(public modules?: DingTalkModuleOption) {
    if (modules) {
      modules.cache && DingTalkModules.setCache(modules.cache)
      modules.logger && DingTalkModules.setLogger(modules.logger)
    }
  }

  async updateSuitTicket(suitTicket: string, expireIn: number = 7200) {
    await DingTalkModules.cache.set('suitTicket', suitTicket, expireIn)
    try {
      const res = await this.isv.getSuitAccessToken()
      const {suite_access_token: suitAccessToken, expires_in: tokenExpireIn, errmsg} = res
      if (suitAccessToken) {
        DingTalkModules.logger(`更新 Suit Ticket: `, { suitTicket, suitAccessToken })
        return DingTalkModules.cache.set('suitAccessToken', suitAccessToken, tokenExpireIn)
      } else {
        return Promise.reject(`获取 suit Access Token 错误: ${errmsg}`)
      }
    } catch(err) {
      DingTalkModules.logger('获取 suit Access Token 错误:', err)
    }
  }

  getSuitTicket() {
    return DingTalkModules.cache.get('suitTicket')
  }

  getSuitAccessToken() {
    return DingTalkModules.cache.get('suitAccessToken')
  }

}
