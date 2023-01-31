import { COTTask, COTTaskPatchData, COTTaskPostData, COTTaskQuery, FilteredTasks, multiTaskBody, queryTaskFilterOptions } from '@customTypes/COTTypes/COTTask'
import { ObjectId } from '@customTypes/custom'
import HttpClient from "@utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'

export default class COTTaskClient extends HttpClient{
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

  public async patchMultiTasks(taskGroupId: ObjectId, body: multiTaskBody): Promise<COTTask[]> {
    return (await this.instance.post<COTTask[]>(`/api/tasks/${taskGroupId}/task/multi`, body))
  }

  public async queryTasksFilter(taskGroupId: string, filterId: string, options?: queryTaskFilterOptions): Promise<FilteredTasks[]> {
    const qParams: Partial<Record<keyof queryTaskFilterOptions, string>> = {}
    if (options) {
      if (options.limit) qParams.limit = String(options.limit)
      if (options.limitBy) qParams.limitBy = options.limitBy
    }
    const queryParams = (options && new URLSearchParams(qParams).toString()) || {}
    return (await this.instance.get<FilteredTasks[]>(`/api/tasks/${taskGroupId}/task?filter=${filterId}&${queryParams}`))
  }
} 
