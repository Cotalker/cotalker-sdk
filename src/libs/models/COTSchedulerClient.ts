import { ScheduleBody, SchedulePostResponse  } from "@customTypes/COTTypes/scheduler"
import HttpClient from "../../utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'


export default class COTSchedulerClient extends HttpClient{
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

  public async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this.instance.post('/api/uservices/scheduler/run', body)
  }
  public async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this.instance.post('/api/uservices/scheduler', body)
  }
} 


