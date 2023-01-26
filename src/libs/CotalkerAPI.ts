import { URLSearchParams } from 'url'
import * as querystring from 'querystring'
import { InternalAxiosRequestConfig } from 'axios'
import HttpClient from '../utils/HttpClient'
import { ObjectId } from '../customTypes/custom'
import { COTAnswer } from "../customTypes/COTTypes/COTAnswer"
import { COTChannel, COTChannelPostBody } from '../customTypes/COTTypes/COTChannel'
import { COTPropertyType } from '../customTypes/COTTypes/COTPropertyType'
import { COTProperty, COTPropertyPostBody }  from '../customTypes/COTTypes/COTProperty'
import { COTFileUploaded } from '../customTypes/COTTypes/COTFile'
import { COTTask, COTTaskPatchData, COTTaskPostData, COTTaskQuery} from '../customTypes/COTTypes/COTTask'
import { COTSurvey } from '../customTypes/COTTypes/COTSurvey'
import { COTUser, COTUserActivity } from '../customTypes/COTTypes/COTUser'
import { COTSMState } from '../customTypes/COTTypes/COTSMState'
import { FilteredTasks, queryTaskFilterOptions } from '../customTypes/COTTypes/COTTask'
import { ScheduleBody, SchedulePostResponse } from '../customTypes/COTTypes/scheduler'

type isActiveOptions = 'true'|'false'|'all'

type JSONPatchBody = {
  op: 'add'|'remove'|'replace'|'move'|'copy'|'test'
  path: `/${string}`, value?: unknown
}[]

type searchPropertyQueryOptions = {
  parent?: string | string[]
}

type SendMsgBody = {
  channel: ObjectId,
  content: string,
  contentType: 'text/system' | 'text/plain',
  isSaved: 2,
  sentBy: ObjectId
}

export class CotalkerAPI extends HttpClient {
  private _cotalkerToken: string
  public constructor(token: string, baseURL?:string) {
    super(baseURL ?? 'https://staging.cotalker.com', false)
    this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? '').replace(/^Bearer /g, '')
    this._initializeRequestInterceptor()
  }

  private _handleRequest = async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) return
    config.headers['Authorization'] = `Bearer ${this._cotalkerToken}`
    config.headers['Content-Type'] = 'application/json'
    config.headers['admin'] = 'true'
    return config
  }
  
  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError,
    )
  }
  

  public static async login(email: string, password: string): Promise<string> {
    return (await super.post<{ token: string }>(
      `${process.env.BASE_URL}/auth/local`,
      { 'Content-Type': 'application/json' },
      { email, password }
    )).token
  }

  public async runSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this.instance.post('/api/uservices/scheduler/run', body)
  }
  public async postSchedule(body: ScheduleBody): Promise<SchedulePostResponse> {
    return await this.instance.post('/api/uservices/scheduler', body)
  }

  /* COTProperty */
  public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
    return (await this.instance.get<{data: T}>(`/api/v2/properties/${_id}`)).data
  }
  public async getPropertyByCode<T extends COTProperty>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/properties/code/${code}`)).data
  }

  /* COTPropertyType */
  public async getPropertyTypeByCode<T extends COTPropertyType>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/propertyTypes/code/${code}`)).data
  }

  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions)
  : Promise<T> {
    const query: Record<string, string|string[]> = { search, ...(options??{}) }
    if (propertyType) query.propertyTypes = propertyType
    return (await this.instance.get(`/api/v2/properties?${new URLSearchParams(query).toString()}`)).data?.properties ?? []
  }
  public async getSubproperties<T extends COTProperty>(property: COTProperty, isActive?: isActiveOptions): Promise<T[]>
  public async getSubproperties<T extends COTProperty>(property: ObjectId,isActive?: isActiveOptions): Promise<T[]>
  public async getSubproperties<T extends COTProperty>(
    property: ObjectId | COTProperty, isActive?: isActiveOptions): Promise<T[]> {
    if (typeof property === 'string') return (await this.instance.get<{ data: { properties: T[] } }>(
      `/api/v2/properties/relations?property=${property}&relation=child&isActive=${isActive ?? 'all'}`)).data?.properties
    if (!property.subproperty?.length) return []
    const qParams = new URLSearchParams({ ids: property.subproperty, limit: '100' }) 
    return (await this.instance.get<{ data: { properties: T[] } }>(
      `/api/v2/properties?${qParams.toString()}`)).data?.properties
  }
  public async postProperty<T extends COTProperty>(property: COTPropertyPostBody): Promise<T> {
    return (await this.instance.post<{data: T}>('/api/v2/properties', property)).data
  }
  public async patchProperty<T extends COTProperty>(propertyId: ObjectId, body: Partial<COTProperty>): Promise<T> {
    return (await this.instance.patch<{data: T}>(`/api/v2/properties/${propertyId}`, body)).data
  }
  public async jsonPatchProperty<T extends COTProperty>(propertyId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/properties/jsonpatch/${propertyId}`, body)).data
  }
  public async getAllFromPropertyType<T extends COTProperty>(propertyType: string): Promise <T[]> {
    let count = 1
    let page = 1
    const properties: T[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, properties: T[] } }>(
        `/api/v2/properties?page=${page}&propertyTypes=${propertyType}&limit=100&isActive=true&count=true`)) 
      properties.push(...(response.data?.properties ?? []))
      count = response.data?.count ?? properties.length
      page++
    } while(properties.length < count)
    return properties
  }
  public async getExtensionProperty<T extends COTProperty>(taskId: ObjectId, extensionKey: string) {
    const { data } = (await this.instance.get<{ data: T }>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`))
    if (Array.isArray(data) && data[0]) return data[0]
  }
  /* COTSurvey */
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


  /* COTAnswer */
  public async getAnswer(answerId: ObjectId): Promise<COTAnswer> {
    return (await this.instance.get<{data:COTAnswer}>(`/api/v2/answers/${answerId}`))?.data
  }

  /* COTTask */
  public async getTask<T extends COTTask>(taskId: ObjectId, taskGroupId: ObjectId): Promise<COTTask> {
    return (await this.instance.get<T>(`/api/tasks/${taskGroupId}/task/${taskId}`))
  }
  public async getTaskBySerial(taskSerial: number, taskGroupId: ObjectId): Promise<COTTask> {
    return (await this.instance.get<COTTask>(`/api/tasks/${taskGroupId}/task/serial/${taskSerial}`))
  }
  public async patchTask(taskId: ObjectId, taskGroupId: ObjectId, body: COTTaskPatchData): Promise<COTTask> {
    return (await this.instance.patch<COTTask>(`/api/tasks/${taskGroupId}/task/${taskId}`, body))
  }
  public async findTasks<T extends COTTask>(taskGroupId: ObjectId, query: COTTaskQuery): Promise<T[]> {
    return (await this.instance.post<T[]>(`/api/tasks/${taskGroupId}/task/all`, query))
  }
  public async postTask<T extends COTTask>(taskData: COTTaskPostData): Promise<T> {
    return (await this.instance.post<{task: T}>(`/api/tasks/${taskData.taskGroup}/task/create?requiredSurvey=false`, taskData)).task
  }

  public async patchMultiTasks(taskGroupId: ObjectId, body: {cmd: {method: string, task: COTTask}[]}): Promise<COTTask[]> {
    return (await this.instance.post<COTTask[]>(`/api/tasks/${taskGroupId}/task/multi`, body))
  }

  /* Filter Tasks */
  public async queryTasksFilter(taskGroupId: string, filterId: string, options?: queryTaskFilterOptions): Promise<FilteredTasks[]> {
    const qParams: Partial<Record<keyof queryTaskFilterOptions, string>> = {}
    if (options) {
      if (options.limit) qParams.limit = String(options.limit)
      if (options.limitBy) qParams.limitBy = options.limitBy
    }
    const queryParams = (options && new URLSearchParams(qParams).toString()) || {}
    return (await this.instance.get<FilteredTasks[]>(`/api/tasks/${taskGroupId}/task?filter=${filterId}&${queryParams}`))
  }

  /* Users */
  public async getUsersByAccessRole(role: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, users: COTUser[] } }>(
        `/api/v2/users?accessRole=${role}&count=true&limit=100&page=${page}&isActive=true`)) 
      users.push(...response.data.users)
      count = response.data.count 
      page++
    } while(users.length < count)
    return users
  }

  public async getUsersByRelation(type: string, _id: ObjectId): Promise<COTUser[]> {
    return (await this.instance.get(`/api/v2/users/relations/${type}/${_id}?limit=100&isActive=true`))?.data?.users ?? ''
  }
  public async getUser(_id: ObjectId): Promise<COTUser> {
    return (await this.instance.get(`/api/v2/users/${_id}`)).data
  }

  public async getUsersByJob(job: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this.instance.get<{ data: { count: number, users: COTUser[] } }>(
        `/api/v2/users?job=${job}&count=true&limit=100&page=${page}&isActive=true`)) 
      users.push(...response.data.users)
      count = response.data.count 
      page++
    } while(users.length < count)
    return users
  }

  public async getUsersByEmail(email: string): Promise<COTUser> {
    return (await this.instance.get(`/api/v2/users?email=${email}`))?.data?.users[0]
  }

  public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
    return (await this.instance.get(`/api/v2/user-activities/${_id}`)).data
  }

  public static async getUserMe(token: string): Promise<COTUser> {
    const _token = token.replace(/^Bearer /, '')
    return (await super.get(
      `${process.env.BASE_URL}/api/users/me`,
      { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${_token}`},
    ))
  }

  public async jsonPatchUser<T extends COTUser>(userId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/users/jsonpatch/${userId}`, body)).data
  }

  public async getSubordiantes(user: COTUser): Promise<COTUser[]> {
    const qParams = querystring.encode({ id: user.companies[0].hierarchy.subordinate, limit: '100' })
    return (await this.instance.get(`/api/v2/users?${qParams}`)).data.users
  }
  /* smStates */
  public async getSmStates(taskGroup: ObjectId): Promise<COTSMState[]> {
    return (await this.instance.get(`/api/v1/tasks/${taskGroup}/sm/smstate/all`))
  }

  /* channels */
  public async createChannel<T extends COTChannel>(body: COTChannelPostBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v2/channels', body)).data
  }
  

  /* messages */
  public async sendMessage<T>(body: SendMsgBody): Promise<T> {
    return (await this.instance.post<{data:T}>('/api/v1/messages', body)).data
  }

  /* files */
  public async getFileObjectById(fileId: ObjectId): Promise<COTFileUploaded> {
    return (await this.instance.get(`/api/v3/media/file/${fileId}`))
  }
  
}
