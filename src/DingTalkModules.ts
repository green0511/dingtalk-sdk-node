import DingTalkDefaultCache from './DingTalkDefaultCache'

export interface DingTalkLogger {
  (...args: any[]): void
}

export interface DingTalkCache {
  get: (key: string) => Promise<any>
  set: (key: string, value: any, expireIn?: number) => Promise<any>
}

export interface DingTalkModuleOption {
  logger?: DingTalkLogger
  cache?: DingTalkCache
}

export class DingTalkModules {

  logger: DingTalkLogger = (msg) => { console.log(msg) }
  cache: DingTalkCache = DingTalkDefaultCache
  setLogger(logger: DingTalkLogger) {
    this.logger = logger
  }
  setCache(cache: DingTalkCache) {
    this.cache = cache
  }

}

export default new DingTalkModules()
