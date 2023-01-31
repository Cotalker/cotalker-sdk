import { COTSMState } from "../../customTypes/COTTypes/COTSMState"
import { ObjectId } from '../../customTypes/custom'
import HttpClient from "../../utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'


export default class COTSMStateClient extends HttpClient{
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

  public async getSmStates(taskGroup: ObjectId): Promise<COTSMState[]> {
    return (await this.instance.get(`/api/v1/tasks/${taskGroup}/sm/smstate/all`))
  }
  
} 
