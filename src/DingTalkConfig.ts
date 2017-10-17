export interface DingTalkConfig {
  // 注册时填写的 token
  token?: string,
  // 注册时填写的数据加密密钥
  encodingAESKey?: string,
  // 套件
  // 创建后生成的 suitKey
  suitKey?: string
  suitSecret?: string
}

export class DingTalkConfigModule {

  config: DingTalkConfig = {}

  constructor(config?: DingTalkConfig) {
    config && this.updateConfig(config)
  }

  updateConfig(config: DingTalkConfig) {
    config && (this.config = Object.assign(this.config, config))
  }
}

export const ConfigModule = new DingTalkConfigModule()
