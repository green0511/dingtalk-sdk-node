import * as crypto from 'crypto'
import { ConfigModule, DingTalkConfig } from '../DingTalkConfig'

const { config } = ConfigModule

// 对钉钉 POST 过来的消息体 进行加解密
export class DingTalkEncryptor {

  iv: string = this.getRandomString(16)
  
  getAESKey() {
    // encodingAESKey 后追加 '='，再进行 BASE64 解码
    return new Buffer(config.encodingAESKey + '=', 'base64')
  }

  // 对消息体签名 每次收到钉钉的 POST 消息，都必须先进行签名 验证其合法性
  sign(msg: string, timestamp: number, nonce: string): string {
    const str = [config.token, timestamp, nonce, msg].sort().join('')
    return this.sha(str)
  }

  sha(msg: string) {
    const sha1 = crypto.createHash('sha1')
    return sha1.update(msg).digest('hex')
  }

  // 对消息体解密
  decryptMsg(encrypt: string): any {
    const AESKey = this.getAESKey()
    const decipher = crypto.createDecipheriv('aes-256-cbc', AESKey, this.iv)
    decipher.write(new Buffer(encrypt, 'base64'))
    let dec: any = decipher.read()
    const msgLengthBuffer = dec.slice(16, 20)
    const msgLength = msgLengthBuffer.readInt32BE()
    const randBuffer = dec.slice(20, 20 + msgLength)
    return (JSON.parse(randBuffer.toString('utf-8')))
  }

  encryptMsg(msg: string): string {
    const randomBuffer = new Buffer(this.getRandomString(16), 'utf-8')
    const buffer = new Buffer(msg, 'utf-8')
    const lengthBuffer = new Buffer(4)
    lengthBuffer.writeUInt32BE(buffer.length, 0)
    const suitKeyBytes = new Buffer(config.suitKey, 'utf-8')
    const AESKey = this.getAESKey()
    const newBuffer = Buffer.concat([randomBuffer, lengthBuffer, buffer, suitKeyBytes])
    const cipher = crypto.createCipheriv('aes-256-cbc', AESKey, this.iv)
    const cipheredMsg = Buffer.concat([cipher.update(newBuffer), cipher.final()])
    return cipheredMsg.toString('base64')
  }

  getRandomString(length: number): string {
    let str = ''
    while(str.length < length) {
      str += generator()
    }
    return str.substr(0, length)
  
    function generator():string {
      return Math.random().toString(36).substr(2)
    }
  }

  // 加密并生成签名
  encryptAndSign(msg: string): DingTalkSignMsg {
    const encryptMsg = this.encryptMsg(msg)
    const timeStamp = Date.now()
    const nonce = this.getRandomString(6)
    const signature = this.sign(encryptMsg, timeStamp, nonce)
    return {
      nonce,
      timeStamp,
      msg_signature: signature,
      encrypt: encryptMsg
    }
  }
}

export interface DingTalkSignMsg {
  nonce: string,
  timeStamp: number,
  msg_signature: string,
  encrypt: string
}
