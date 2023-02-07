import { AxiosInstance } from 'axios'
import { ObjectId } from '@customTypes/custom'
import { COTAnswer } from '@customTypes/COTTypes/COTAnswer'

export default class COTAnswerClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getAnswer(answerId: ObjectId): Promise<COTAnswer> {
    return (await this._instance.get<{ data: COTAnswer }>(`/api/v2/answers/${answerId}`))?.data
  }
}
