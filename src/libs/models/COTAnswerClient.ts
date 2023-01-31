import { COTAnswer } from "../../customTypes/COTTypes/COTAnswer"
import { ObjectId } from '../../customTypes/custom'

import HttpClient from "../../utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'


export default class COTAnswerClient extends HttpClient{
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

  public async getAnswer(answerId: ObjectId): Promise<COTAnswer> {
    return (await this.instance.get<{data:COTAnswer}>(`/api/v2/answers/${answerId}`))?.data
  }
  
} 

