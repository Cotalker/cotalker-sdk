import HttpClient from '@utils/HttpClient'
import { InternalAxiosRequestConfig } from 'axios'
import { SendMsgBody, EditMsgBody, RmMsgBody } from '@customTypes/COTTypes/COTMessage'
import { ObjectId } from '@customTypes/custom'

export default class COTMessageClient extends HttpClient{
  private _cotalkerToken: string
  public constructor(token: string, baseURL?:string) {
    super(baseURL ?? 'https://staging.cotalker.com', false)
    this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? '').replace(/^Bearer /g, '')
    this._initializeRequestInterceptor()
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError,
    )
  }
    
  private _handleRequest = async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) return
    config.headers['Authorization'] = `Bearer ${this._cotalkerToken}`
    config.headers['Content-Type'] = 'application/json'
    config.headers['admin'] = 'true'
    return config
  }
  async sendMessage<T>(body: SendMsgBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v1/messages', body)).data
  }
  
  async editMessage<T>(_messageId: ObjectId, body: EditMsgBody): Promise<T> {
    return (await this.instance.patch<{data:T}>('/api/v1/messages/${_messageId}', body)).data
  }
  
  async removeMessage<T>(_messageId: ObjectId, body: RmMsgBody): Promise<T> {
    return (await this.instance.patch<{data:T}>('/api/v1/messages/${_messageId}/remove', body)).data
  }
} 