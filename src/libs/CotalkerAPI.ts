import  COTFileClient  from '@models/COTFileClient'
import  COTTaskClient  from '@models/COTTaskClient'
import  COTUserClient  from '@models/COTUserClient'
import  COTLoginClient  from '@models/COTLoginClient'
import  COTSurveyClient  from '@models/COTSurveyClient'
import  COTAnswerClient  from '@models/COTAnswerClient'
import  COTMessageClient  from '@models/COTMessageClient'
import  COTChannelClient  from '@models/COTChannelClient'
import  COTSMStateClient  from '@models/COTSMStateClient'
import  COTPropertyClient  from '@models/COTPropertyClient'
import  COTSchedulerClient  from '@models/COTSchedulerClient'
import  COTPropertyTypeClient  from '@models/COTPropertyTypeClient'
import { ObjectId } from '@customTypes/custom'
import { COTUser } from '@customTypes/COTTypes/COTUser'
import { ScheduleBody } from '@customTypes/COTTypes/scheduler'
import { SendMsgBody } from '@customTypes/COTTypes/COTMessage'
import { COTChannelPostBody } from '@customTypes/COTTypes/COTChannel'
import { isActiveOptions, JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTProperty, COTPropertyPostBody, searchPropertyQueryOptions } from '@customTypes/COTTypes/COTProperty'
import { COTTaskPatchData, COTTaskPostData, COTTaskQuery, multiTaskBody, queryTaskFilterOptions } from '@customTypes/COTTypes/COTTask'

export class CotalkerAPI {
  private _cotfileClient : COTFileClient
  private _cottaskClient : COTTaskClient
  private _cotuserClient : COTUserClient
  private _cotsurveyClient : COTSurveyClient
  private _cotanswerClient : COTAnswerClient
  private _cotmessageClient : COTMessageClient
  private _cotchannelClient : COTChannelClient
  private _cotsmStateClient : COTSMStateClient
  private _cotpropertyClient : COTPropertyClient
  private _cotschedulerClient : COTSchedulerClient
  private _cotpropertyTypeClient : COTPropertyTypeClient
 

  public constructor(token: string, baseURL?:string) {
    this._cotfileClient = new COTFileClient(token, baseURL) 
    this._cottaskClient = new COTTaskClient(token, baseURL) 
    this._cotuserClient = new COTUserClient(token, baseURL) 
    this._cotsurveyClient = new COTSurveyClient(token, baseURL) 
    this._cotanswerClient = new COTAnswerClient(token, baseURL) 
    this._cotmessageClient = new COTMessageClient(token, baseURL) 
    this._cotchannelClient = new COTChannelClient(token, baseURL) 
    this._cotsmStateClient = new COTSMStateClient(token, baseURL)  
    this._cotpropertyClient = new COTPropertyClient(token, baseURL) 
    this._cotschedulerClient = new COTSchedulerClient(token, baseURL) 
    this._cotpropertyTypeClient = new COTPropertyTypeClient(token, baseURL)  
  }
  
  /* COTLogin*/
  static async login(email:string, password:string){
    return await COTLoginClient.login(email, password)
  }
  
  /* COTScheduler*/
  async runSchedule(body: ScheduleBody){
    return await this._cotschedulerClient.runSchedule(body)
  }
  async postSchedule(body: ScheduleBody){
    return await this._cotschedulerClient.postSchedule(body)
  }

  /* COTAnswer */
  async getAnswer(answerId: ObjectId){
    return await this._cotanswerClient.getAnswer(answerId)
  }

  /* COTTask */
  async getTask(taskId: ObjectId, taskGroupId: ObjectId){
    return await this._cottaskClient.getTask(taskId, taskGroupId)
  }
  async getTaskBySerial(taskSerial: number, taskGroupId: ObjectId){
    return await this._cottaskClient.getTaskBySerial(taskSerial, taskGroupId)
  }
  async patchTask(taskId: ObjectId, taskGroupId: ObjectId, body: COTTaskPatchData){
    return await this._cottaskClient.patchTask(taskId, taskGroupId, body)
  }
  async patchMultiTasks(taskGroupId: ObjectId, body: multiTaskBody){
    return await this._cottaskClient.patchMultiTasks(taskGroupId, body)
  }
  async findTasks(taskGroupId: ObjectId, query: COTTaskQuery){
    return await this._cottaskClient.findTasks(taskGroupId, query)
  }
  async queryTasksFilter(taskGroupId: string, filterId: string, options?: queryTaskFilterOptions){
    return await this._cottaskClient.queryTasksFilter(taskGroupId, filterId, options)
  }
  async postTask(taskData: COTTaskPostData){
    return await this._cottaskClient.postTask(taskData)
  }

  /* COTUser */
  async getUser(id: ObjectId){
    return await this._cotuserClient.getUser(id)
  }
  static async getUserMe(token: string){
    return await COTUserClient.getUserMe(token)
  }
  async getUsersByAccessRole(role: string){
    return await this._cotuserClient.getUsersByAccessRole(role)
  }
  async getUsersByRelation(type: string, id: ObjectId){
    return await this._cotuserClient.getUsersByRelation(type, id)
  }
  async getUsersByJob(job: string){
    return await this._cotuserClient.getUsersByJob(job)
  }
  async getUsersByEmail(email: string){
    return await this._cotuserClient.getUsersByEmail(email)
  }
  async getUserActivity(id: ObjectId){
    return await this._cotuserClient.getUserActivity(id)
  }
  async jsonPatchUser(userId: ObjectId, body: JSONPatchBody){
    return await this._cotuserClient.jsonPatchUser(userId, body)
  }
  async getSubordinates(user: COTUser){
    return await this._cotuserClient.getSubordiantes(user)
  }
  
  
  /* COTSMStates */
  async getSmStates(taskGroup: ObjectId){
    return await this._cotsmStateClient.getSmStates(taskGroup)
  }

  /* COTChannels */
  
  async getChannel(body: COTChannelPostBody){
    return await this._cotchannelClient.createChannel(body)
  }

  /* COTFiles */
  async getFileObjectById(fileId: ObjectId){
    return await this._cotfileClient.getFileObjectById(fileId)
  }

  /* COTMessages */
  async sendMessage(body: SendMsgBody){
    return await this._cotmessageClient.sendMessage(body)
  }

  /* COTSurvey */
  async getSurvey(surveyId: ObjectId){
    return await this._cotsurveyClient.getSurvey(surveyId)
  }
  async getSurveys(){
    return await this._cotsurveyClient.getSurveys()
  }

  /* COTProperty */
  async getProperty(id: ObjectId) {
    return await this._cotpropertyClient.getProperty(id)
  }
  async getPropertyByCode(code: string) {
    return await this._cotpropertyClient.getPropertyByCode(code)
  }
  async getSubproperties(property:COTProperty| COTProperty, isActive?:isActiveOptions){
    return await this._cotpropertyClient.getSubproperties(property, isActive)
  }
  async postPropety(property: COTPropertyPostBody){
    return await this._cotpropertyClient.postProperty(property)
  }
  async patchPropety(propertyId: ObjectId, body: Partial<COTProperty>){
    return await this._cotpropertyClient.patchProperty(propertyId, body)
  }
  async jsonPatchPropety(propertyId: ObjectId, body: JSONPatchBody){
    return await this._cotpropertyClient.jsonPatchProperty(propertyId, body)
  }

  /* COTPropertyType */
  async getPropertyTypeByCode(code: string) {
    return await this._cotpropertyTypeClient.getPropertyTypeByCode(code)
  }
  async getAllFromPropertyType(propertyType: string) {
    return await this._cotpropertyTypeClient.getAllFromPropertyType(propertyType)
  }
  async getExtensionProperty(taskId: ObjectId, extensionKey: string){
    return await this._cotpropertyTypeClient. getExtensionProperty(taskId, extensionKey)
  }
  async searchProperty(search: string, propertyType?: string, options?:searchPropertyQueryOptions){
    return await this._cotpropertyTypeClient.searchProperty(search, propertyType, options)
  }
}
