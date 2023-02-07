import { COTSurvey } from '@customTypes/COTTypes/COTSurvey'
import { ObjectId } from '@customTypes/custom'
import { AxiosInstance } from 'axios'

export default class COTSurveyClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getSurvey(surveyId: ObjectId): Promise<COTSurvey> {
    return (await this._instance.get<{ data: COTSurvey }>(`/api/v2/surveys/${surveyId}?populate=true`))?.data
  }

  public async getSurveys(): Promise<COTSurvey[]> {
    let count = 1
    let page = 1
    const surveys: COTSurvey[] = []
    do {
      const response = (await this._instance.get<{ data: { count: number; surveys: COTSurvey[] } }>(
        `/api/v2/surveys?count=true&limit=100&page=${page}&isActive=true`,
      ))
      surveys.push(...response.data.surveys)
      count = response.data.count
      page += 1
    } while (surveys.length < count)
    return surveys
  }
}
