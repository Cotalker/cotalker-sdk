/* eslint-disable no-param-reassign */
import { IsActiveOptions, JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTChannel } from '@customTypes/COTTypes/COTChannel'
import { SendMsgBody } from '@customTypes/COTTypes/COTMessage'
import { COTProperty, SearchPropertyQueryOptions } from '@customTypes/COTTypes/COTProperty'
import { COTTaskPatchData, COTTaskPostData, COTTaskQuery, MultiTaskBody, QueryTaskFilterOptions } from '@customTypes/COTTypes/COTTask'
import { COTUser } from '@customTypes/COTTypes/COTUser'
import { ScheduleBody } from '@customTypes/COTTypes/scheduler'
import { ObjectId } from '@customTypes/custom'
import COTAnswerClient from '@models/COTAnswerClient'
import COTChannelClient from '@models/COTChannelClient'
import COTFileClient from '@models/COTFileClient'
import COTMessageClient from '@models/COTMessageClient'
import COTPropertyClient from '@models/COTPropertyClient'
import COTPropertyTypeClient from '@models/COTPropertyTypeClient'
import COTSchedulerClient from '@models/COTSchedulerClient'
import COTSMStateClient from '@models/COTSMStateClient'
import COTSurveyClient from '@models/COTSurveyClient'
import COTTaskClient from '@models/COTTaskClient'
import COTUserClient from '@models/COTUserClient'
import HttpClient from '@utils/HttpClient'
import { InternalAxiosRequestConfig } from 'axios'

export class CotalkerAPI extends HttpClient {
  private _cotfileClient: COTFileClient

  private _cottaskClient: COTTaskClient

  private _cotuserClient: COTUserClient

  private _cotsurveyClient: COTSurveyClient

  private _cotanswerClient: COTAnswerClient

  private _cotmessageClient: COTMessageClient

  private _cotchannelClient: COTChannelClient

  private _cotsmStateClient: COTSMStateClient

  private _cotpropertyClient: COTPropertyClient

  private _cotschedulerClient: COTSchedulerClient

  private _cotpropertyTypeClient: COTPropertyTypeClient

  private _cotalkerToken: string

  public constructor(token: string, baseURL?: string) {
    super(baseURL ?? 'https://staging.cotalker.com', false)
    this._cotalkerToken = (token ?? process.env.COTALKER_TOKEN ?? '').replace(/^Bearer /g, '')
    this._initializeRequestInterceptor()
    this._cotfileClient = new COTFileClient(this.instance)
    this._cottaskClient = new COTTaskClient(this.instance)
    this._cotuserClient = new COTUserClient(this.instance)
    this._cotsurveyClient = new COTSurveyClient(this.instance)
    this._cotanswerClient = new COTAnswerClient(this.instance)
    this._cotmessageClient = new COTMessageClient(this.instance)
    this._cotchannelClient = new COTChannelClient(this.instance)
    this._cotsmStateClient = new COTSMStateClient(this.instance)
    this._cotpropertyClient = new COTPropertyClient(this.instance)
    this._cotschedulerClient = new COTSchedulerClient(this.instance)
    this._cotpropertyTypeClient = new COTPropertyTypeClient(this.instance)
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError,
    )
  }

  // eslint-disable-next-line require-await, @typescript-eslint/require-await
  private _handleRequest = async (config: InternalAxiosRequestConfig) => {
    if (!config.headers) return
    config.headers.Authorization = `Bearer ${this._cotalkerToken}`
    config.headers['Content-Type'] = 'application/json'
    config.headers.admin = 'true'
    // eslint-disable-next-line consistent-return
    return config
  }

  /* COTLogin*/
  static async login(email: string, password: string): Promise<string> {
    return (await super.post<{ token: string }>(
      `${process.env.BASE_URL}/auth/local`,
      { 'Content-Type': 'application/json' },
      { email, password },
    )).token
  }

  /* COTScheduler*/
  async runSchedule(body: ScheduleBody) {
    const schedule = await this._cotschedulerClient.runSchedule(body)
    return schedule
  }

  async postSchedule(body: ScheduleBody) {
    const schedule = await this._cotschedulerClient.postSchedule(body)
    return schedule
  }

  /* COTAnswer */
  async getAnswer(answerId: ObjectId) {
    const answer = await this._cotanswerClient.getAnswer(answerId)
    return answer
  }

  /* COTTask */
  async getTask(taskId: ObjectId, taskGroupId: ObjectId) {
    const task = await this._cottaskClient.getTask(taskId, taskGroupId)
    return task
  }

  async getTaskBySerial(taskSerial: number, taskGroupId: ObjectId) {
    const task = await this._cottaskClient.getTaskBySerial(taskSerial, taskGroupId)
    return task
  }

  async patchTask(taskId: ObjectId, taskGroupId: ObjectId, body: COTTaskPatchData) {
    const task = await this._cottaskClient.patchTask(taskId, taskGroupId, body)
    return task
  }

  async patchMultiTasks(taskGroupId: ObjectId, body: MultiTaskBody) {
    const task = await this._cottaskClient.patchMultiTasks(taskGroupId, body)
    return task
  }

  async findTasks(taskGroupId: ObjectId, query: COTTaskQuery) {
    const task = await this._cottaskClient.findTasks(taskGroupId, query)
    return task
  }

  async queryTasksFilter(taskGroupId: string, filterId: string, options?: QueryTaskFilterOptions) {
    const task = await this._cottaskClient.queryTasksFilter(taskGroupId, filterId, options)
    return task
  }

  async postTask(taskData: COTTaskPostData) {
    const task = await this._cottaskClient.postTask(taskData)
    return task
  }
  
  /* COTUser */

  static async getUserMe(_token: string): Promise<COTUser> {
    const token = _token.replace(/^Bearer /, '')
    const me: COTUser = await (super.get(
      `${process.env.BASE_URL}/api/users/me`,
      { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
    ))
    return me
  }

  async getUser(id: ObjectId) {
    const user = await this._cotuserClient.getUser(id)
    return user
  }

  async getUsersByAccessRole(role: string) {
    const user = await this._cotuserClient.getUsersByAccessRole(role)
    return user
  }

  async getUsersByRelation(type: string, id: ObjectId) {
    const user = await this._cotuserClient.getUsersByRelation(type, id)
    return user
  }

  async getUsersByJob(job: string) {
    const user = await this._cotuserClient.getUsersByJob(job)
    return user
  }

  async getUsersByEmail(email: string) {
    const user = await this._cotuserClient.getUsersByEmail(email)
    return user
  }
  
  async getUserByEmail(email: string) {
    const user = await this._cotuserClient.getUserByEmail(email)
    return user
  }

  async getAllUsersByAccessRole(accessRole:string) {
    const user = await this._cotuserClient.getAllUsersByAccessRole(accessRole)
    return user
  }
  
  public async getAllUsersByAccessRoleQuery(accessRole:string) {
    const users = await this._cotuserClient.getAllUsersByAccessRoleQuery(accessRole)
    return users
  }

  async getUserActivity(id: ObjectId) {
    const user = await this._cotuserClient.getUserActivity(id)
    return user
  }
  
  async getSubordinates(user: COTUser) {
    const subordinate = await this._cotuserClient.getSubordiantes(user)
    return subordinate
  }

  async jsonPatchUser(userId: ObjectId, body: JSONPatchBody) {
    const user = await this._cotuserClient.jsonPatchUser(userId, body)
    return user
  }


  /* COTSMStates */
  async getSmStates(taskGroup: ObjectId) {
    const smState = await this._cotsmStateClient.getSmStates(taskGroup)
    return smState
  }

  /* COTChannels */

  async getChannel(body: COTChannel) {
    const channel = await this._cotchannelClient.createChannel(body)
    return channel
  }

  /* COTFiles */
  async getFileObjectById(fileId: ObjectId) {
    const file = await this._cotfileClient.getFileObjectById(fileId)
    return file
  }

  /* COTMessages */
  async sendMessage(body: SendMsgBody) {
    const message = await this._cotmessageClient.sendMessage(body)
    return message
  }

  /* COTSurvey */
  async getSurvey(surveyId: ObjectId) {
    const survey = await this._cotsurveyClient.getSurvey(surveyId)
    return survey
  }

  async getSurveys() {
    const survey = await this._cotsurveyClient.getSurveys()
    return survey
  }

  /* COTProperty */
  async getProperty(id: ObjectId) {
    const property = await this._cotpropertyClient.getProperty(id)
    return property
  }

  async getPropertyByCode(code: string) {
    const property = await this._cotpropertyClient.getPropertyByCode(code)
    return property
  }

  async getSubproperties(property: COTProperty | COTProperty, isActive?: IsActiveOptions) {
    const subproperty = await this._cotpropertyClient.getSubproperties(property, isActive)
    return subproperty
  }

  async postPropety(_property: COTProperty) {
    const property = await this._cotpropertyClient.postProperty(_property)
    return property
  }

  async patchPropety(propertyId: ObjectId, body: Partial<COTProperty>) {
    const property = await this._cotpropertyClient.patchProperty(propertyId, body)
    return property
  }

  async jsonPatchPropety(propertyId: ObjectId, body: JSONPatchBody) {
    const property = await this._cotpropertyClient.jsonPatchProperty(propertyId, body)
    return property
  }

  /* COTPropertyType */
  async getPropertyTypeByCode(code: string) {
    const property = await this._cotpropertyTypeClient.getPropertyTypeByCode(code)
    return property
  }

  async getAllFromPropertyType(propertyType: string) {
    const property = await this._cotpropertyTypeClient.getAllFromPropertyType(propertyType)
    return property
  }

  async getExtensionProperty(taskId: ObjectId, extensionKey: string) {
    const property = await this._cotpropertyTypeClient.getExtensionProperty(taskId, extensionKey)
    return property
  }

  async searchProperty(search: string, propertyType?: string, options?: SearchPropertyQueryOptions) {
    const property = await this._cotpropertyTypeClient.searchProperty(search, propertyType, options)
    return property
  }
}
