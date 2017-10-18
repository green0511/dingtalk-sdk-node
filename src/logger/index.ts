import * as EventEmitter from 'events'

const loggerEmmiter = new EventEmitter()

const logEventType = 'LOGGING'

export interface LogBody {
  type: 'info' | 'warning' | 'error'
  module: 'isv' | 'encryptor' | 'sdk' | 'storage'
  message: string
  payload?: any
}

export interface Logger {
  (logBody?: LogBody):　any
}

export class LoggerModule {

  addLogger(listener: Logger) {
    listener && loggerEmmiter.addListener(logEventType, listener)
  }

  log(logBody: LogBody) {
    loggerEmmiter.emit(logEventType, logBody)
  }
}

export default new LoggerModule()
