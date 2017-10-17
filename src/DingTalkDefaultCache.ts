import { DingTalkCache } from './DingTalkModules'

export interface CacheOption {
  logger?: (...args: any[]) => void
}

export interface CacheStore {
  [key: string]: CacheStoreValue
}

export interface CacheStoreValue {
  value: any
  expireIn?: number
  expireTime?: number
}

export class Cache implements DingTalkCache {

  logger: (...args: any[]) => void = function() {}

  constructor(option?: CacheOption) {
    option && option.logger && (this.logger = option.logger)
  }

  private store: CacheStore = {}

  private expireSafeTime: number = 300 // 5 min

  set(key: string, value: any, expireIn?: number): Promise<any> {
    this.logger('Cache SET: ', { key, value })
    this.store[key] = {
      value,
      expireIn,
      expireTime: expireIn ? Date.now() + (expireIn - this.expireSafeTime) * 1000 : undefined
    }
    return Promise.resolve(value)
  }

  get(key: string): Promise<any> {
    const value = this.store[key]
    return new Promise((resolve, reject) => {
      const v = value && value.value
      if (v === undefined) {
        resolve()
      }
      if (!value.expireTime || Date.now() < value.expireTime) {
        this.logger('Cache GET: ', { key, ...value })
        resolve(v)
      } else {
        this.store[key] = undefined
        resolve()
      }
    })
  }
}

export default new Cache({
  logger(msg, data) {
    const str = Object.keys(data).map(k => `${k}=${data[k]}`).join(' ')
    console.log(`${msg} ${str}`)
  }
})
