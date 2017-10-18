import { DingTalkConfig, ConfigModule } from './DingTalkConfig'
import encryptor, { DingTalkEncryptor } from './encryptor/index'
import isv, { DingTalkIsvApi }  from './isv/index'
import { suitStorage } from './storage'

export default class DingTalkSDK {

  encryptor: DingTalkEncryptor = encryptor
  isv: DingTalkIsvApi = isv

  public config(config: DingTalkConfig) {
    ConfigModule.updateConfig(config);
  }

  async updateSuitTicket(suitTicket: string): Promise<boolean> {
    suitStorage.suitTicket = suitTicket
    try {
      const res = await this.isv.getSuitAccessToken(suitTicket)
      const {suite_access_token: suitAccessToken, expires_in: tokenExpireIn, errmsg} = res
      if (suitAccessToken) {
        suitStorage.suitAccessToken = suitAccessToken
      }
      return !!suitAccessToken
    } catch(err) {
      return false
    }
  }

  getSuitTicket() {
    return suitStorage.suitTicket
  }
  
  getSuitAccessToken() {
    return suitStorage.suitAccessToken
  }

}
