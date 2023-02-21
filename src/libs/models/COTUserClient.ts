import { JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTUser, COTUserActivity, UsersQueryParams } from '@customTypes/COTTypes/COTUser'
import { ObjectId } from '@customTypes/custom'
import { QueryHandler } from '@utils/QueryHandler'
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'

export type AllowedRelation = 'boss' | 'peers' | 'subordinate' | 'property' | 'accessrole' | 'relateduser'


export default class COTUserClient {
  protected readonly _instance: AxiosInstance

  private queryHandler

  
  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('users', this._instance)
  }

  public async getUserQuery(query:UsersQueryParams): Promise<COTUser> {
    return this.getUsersQuery(query)[0]
  }
  
  public async getUsersQuery(query:UsersQueryParams): Promise<COTUser[]> {
    return (await this.queryHandler.getQuery(query)).users
  }
  
  public async getAllUsersInQuery(query:UsersQueryParams): Promise<COTUser[]> {
    return this.queryHandler.getAllInQuery(query)
  }

  public async getUser(_id: ObjectId): Promise<COTUser> {
    return (await this._instance.get(`/api/v2/users/${_id}`)).data
  }
  
  public async getUsersByAccessRole(accessRole: ObjectId): Promise<COTUser[]> {
    return this.getAllUsersInQuery({ accessRole })
  }
  
  public async getUsersByJob(job: ObjectId): Promise<COTUser[]> {
    return this.getAllUsersInQuery({ job })
  }
  
  public async getUserByEmail(email: string): Promise<COTUser> {
    return (this.getUserQuery({ email }))
  }
  
  public async getUsersByEmail(email: string[] | string ): Promise<COTUser[]> {
    return this.getAllUsersInQuery({ email })
  }
  
  public async getUsersByRole(role: string): Promise<COTUser[]> {
    return this.getAllUsersInQuery({ role })
  }
  
  public async getUsersByJobTitle(jobTitle: string): Promise<COTUser[]> {
    return this.getAllUsersInQuery({ jobTitle })
  }
  
  public async getUsersByRelation(type: AllowedRelation, _id: ObjectId): Promise<COTUser[]> {
    return (await this._instance.get(`/api/v2/users/relations/${type}/${_id}?limit=100&isActive=true`))?.data?.users ?? ''
  }

  public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
    return (await this._instance.get(`/api/v2/user-activities/${_id}`)).data
  }
  

  public async getSubordiantes(user: COTUser): Promise<COTUser[]> {
    const qParams = querystring.encode({ id: user.companies[0].hierarchy.subordinate, limit: '100' })
    return (await this._instance.get(`/api/v2/users?${qParams}`)).data.users
  }
  
  public async jsonPatchUser<T extends COTUser>(userId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this._instance.patch<{ data: T }>(`/api/v2/users/jsonpatch/${userId}`, body)).data
  }
}
