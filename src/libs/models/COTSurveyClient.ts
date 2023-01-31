import HttpClient from '@utils/HttpClient'
import { InternalAxiosRequestConfig } from 'axios'
import { ObjectId } from '@customTypes/custom'
import { COTSurvey } from '@customTypes/COTTypes/COTSurvey'

export default class COTSurveyClient extends HttpClient{
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

  public async getSurvey(surveyId: ObjectId): Promise<COTSurvey> {
    return (await this.instance.get<{data:COTSurvey}>(`/api/v2/surveys/${surveyId}?populate=true`))?.data
  }

  public async getSurveys(): Promise<COTSurvey[]> {
    let count = 1
    let page = 1
    const surveys: COTSurvey[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, surveys: COTSurvey[] } }>(
        `/api/v2/surveys?count=true&limit=100&page=${page}&isActive=true`)) 
      surveys.push(...response.data.surveys)
      count = response.data.count 
      page++
    } while(surveys.length < count)
    return surveys
  }
} 
