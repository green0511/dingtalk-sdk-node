import * as request from 'request'

export interface HttpConfig {
  baseUrl: string
}

export default class Http {

  constructor(private config: HttpConfig) { }

  get(url: string, params: any = {}): Promise<any> {
    const queryStr = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
    let parsedUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + queryStr
    parsedUrl = parsedUrl[0] === '/' ? parsedUrl : ('/' + parsedUrl)
    return new Promise<any>((resolve, reject) => {
      request({
        url: `${this.config.baseUrl}${parsedUrl}`,
        json: true,
        headers: {
          'content-type': 'application/json'
        }
      }, function(error: any, res:any, body:any) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  }

  post(url: string, body: any = {}): Promise<any> {
    const parsedUrl = url[0] === '/' ? url : ('/' + url)
    return new Promise<any>((resolve, reject) => {
      request({
        url: `${this.config.baseUrl}${parsedUrl}`,
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body,
        json: true
      }, function(error, res, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  }
}