import { COTChannel, COTChannelPostBody } from "../../customTypes/COTTypes/COTChannel"

import HttpClient from "../../utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'


export default class COTChannelClient extends HttpClient{
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

  public async createChannel<T extends COTChannel>(body: COTChannelPostBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v2/channels', body)).data
  }
} 


