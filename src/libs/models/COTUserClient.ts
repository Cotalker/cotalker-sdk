import * as querystring from 'querystring'
import HttpClient from "@utils/HttpClient"
import { InternalAxiosRequestConfig } from 'axios'
import { ObjectId } from '@customTypes/custom'
import { JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTUser, COTUserActivity } from "@customTypes/COTTypes/COTUser"

export default class COTUserClient extends HttpClient{
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
  
  public async getUser(_id: ObjectId): Promise<COTUser> {
    return (await this.instance.get(`/api/v2/users/${_id}`)).data
  }

  public static async getUserMe(token: string): Promise<COTUser> {
    const _token = token.replace(/^Bearer /, '')
    return (await super.get(
      `${process.env.BASE_URL}/api/users/me`,
      { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${_token}`},
    ))
  }

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

  public async jsonPatchUser<T extends COTUser>(userId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/users/jsonpatch/${userId}`, body)).data
  }

  public async getSubordiantes(user: COTUser): Promise<COTUser[]> {
    const qParams = querystring.encode({ id: user.companies[0].hierarchy.subordinate, limit: '100' })
    return (await this.instance.get(`/api/v2/users?${qParams}`)).data.users
  }
} 
