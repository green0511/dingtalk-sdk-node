import { DingTalkConfig, ConfigModule } from './DingTalkConfig'
import encryptor, { DingTalkEncryptor } from './encryptor/index'
import isv, { DingTalkIsvApi }  from './isv/index'
import { suitStorage } from './storage'

import loggerModule, { Logger } from './logger'
import { StringifyOptions } from 'querystring';

export default class DingTalkSDK {

  encryptor: DingTalkEncryptor = encryptor
  isv: DingTalkIsvApi = isv

  public config(config: DingTalkConfig) {
    ConfigModule.updateConfig(config);
    this.isv.updateLocalSuitAccessToken = async () => {
      const suitAccessToken = await this.getSuitAccessToken();
      suitStorage.suitAccessToken = suitAccessToken; 
    }
  }

  // async updateSuitTicket(suitTicket: string): Promise<boolean> {
  //   suitStorage.suitTicket = suitTicket
  //   try {
  //     const res = await this.isv.getSuitAccessToken(suitTicket)
  //     const {suite_access_token: suitAccessToken, expires_in: tokenExpireIn, errmsg} = res
  //     if (suitAccessToken) {
  //       suitStorage.suitAccessToken = suitAccessToken
  //     }
  //     return !!suitAccessToken
  //   } catch(err) {
  //     return false
  //   }
  // }

  // async getSuitTicket() {
    // return suitStorage.suitTicket
  // }
  
  async getSuitAccessToken(): Promise<string> {
    return ''
    // return suitStorage.suitAccessToken
  }

  onLogging(logger: Logger) {
    loggerModule.addLogger(logger)
  }

}
