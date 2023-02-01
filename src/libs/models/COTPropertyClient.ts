import { URLSearchParams } from 'url'
import HttpClient from '@utils/HttpClient'
import { ObjectId } from '@customTypes/custom'
import { InternalAxiosRequestConfig } from 'axios'
import { isActiveOptions, JSONPatchBody } from '@customTypes/COTTypes/APIGenerics'
import { COTProperty } from '@customTypes/COTTypes/COTProperty'

export default class COTPropertyClient extends HttpClient{
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

  public async getProperty<T extends COTProperty>(_id: ObjectId): Promise<T> {
    return (await this.instance.get<{data: T}>(`/api/v2/properties/${_id}`)).data
  }
  public async getPropertyByCode<T extends COTProperty>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/properties/code/${code}`)).data
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

  public async postProperty<T extends COTProperty>(property: COTProperty): Promise<T> {
    return (await this.instance.post<{data: T}>('/api/v2/properties', property)).data
  }

  public async patchProperty<T extends COTProperty>(propertyId: ObjectId, body: Partial<COTProperty>): Promise<T> {
    return (await this.instance.patch<{data: T}>(`/api/v2/properties/${propertyId}`, body)).data
  }

  public async jsonPatchProperty<T extends COTProperty>(propertyId: ObjectId, body: JSONPatchBody): Promise<T> {
    return (await this.instance.patch<{ data: T }>(`/api/v2/properties/jsonpatch/${propertyId}`, body)).data
  }
} 
