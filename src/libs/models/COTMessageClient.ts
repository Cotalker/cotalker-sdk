import { AxiosInstance } from 'axios'
import { SendMsgBody } from '@customTypes/COTTypes/COTMessage'

export default class COTMessageClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  async sendMessage<T>(body: SendMsgBody): Promise<T> {
    return (await this._instance.post<{ data: T }>('/api/v1/messages', body)).data
  }
}
