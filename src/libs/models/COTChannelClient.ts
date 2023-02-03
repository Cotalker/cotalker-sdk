import { AxiosInstance } from 'axios'
import { COTChannel } from '@customTypes/COTTypes/COTChannel'

export default class COTChannelClient {
  protected _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async createChannel<T extends COTChannel>(body: COTChannel): Promise<T> {
    return (await this._instance.post<{ data: T }>('/api/v2/channels', body)).data
  }
}
