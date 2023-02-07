import * as querystring from 'querystring'
import { ObjectId } from '@customTypes/custom'
import { JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTUser, COTUserActivity } from '@customTypes/COTTypes/COTUser'
import { AxiosInstance } from 'axios'

export default class COTUserClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getUser(_id: ObjectId): Promise<COTUser> {
    return (await this._instance.get(`/api/v2/users/${_id}`)).data
  }

  public async getUsersByAccessRole(role: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this._instance.get<{ data: { count: number; users: COTUser[] } }>(
        `/api/v2/users?accessRole=${role}&count=true&limit=100&page=${page}&isActive=true`,
      ))
      users.push(...response.data.users)
      count = response.data.count
      page += 1
    } while (users.length < count)
    return users
  }

  public async getUsersByRelation(type: string, _id: ObjectId): Promise<COTUser[]> {
    return (await this._instance.get(`/api/v2/users/relations/${type}/${_id}?limit=100&isActive=true`))?.data?.users ?? ''
  }

  public async getUsersByJob(job: string): Promise<COTUser[]> {
    let count = 1
    let page = 1
    const users: COTUser[] = []
    do {
      const response = (await this._instance.get<{ data: { count: number; users: COTUser[] } }>(
        `/api/v2/users?job=${job}&count=true&limit=100&page=${page}&isActive=true`,
      ))
      users.push(...response.data.users)
      count = response.data.count
      page += 1
    } while (users.length < count)
    return users
  }

  public async getUsersByEmail(email: string): Promise<COTUser> {
    return (await this._instance.get(`/api/v2/users?email=${email}`))?.data?.users[0]
  }

  public async getUserActivity(_id: ObjectId): Promise<COTUserActivity> {
    return (await this._instance.get(`/api/v2/user-activities/${_id}`)).data
  }

  public async jsonPatchUser<T extends COTUser>(userId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this._instance.patch<{ data: T }>(`/api/v2/users/jsonpatch/${userId}`, body)).data
  }

  public async getSubordiantes(user: COTUser): Promise<COTUser[]> {
    const qParams = querystring.encode({ id: user.companies[0].hierarchy.subordinate, limit: '100' })
    return (await this._instance.get(`/api/v2/users?${qParams}`)).data.users
  }
}
