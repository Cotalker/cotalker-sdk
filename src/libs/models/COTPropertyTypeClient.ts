import { URLSearchParams } from 'url'
import HttpClient from '@utils/HttpClient'
import { InternalAxiosRequestConfig } from 'axios'
import { ObjectId } from '@customTypes/custom'
import { COTPropertyType } from '@customTypes/COTTypes/COTPropertyType'
import { COTProperty, searchPropertyQueryOptions } from '@customTypes/COTTypes/COTProperty'

export default class COTPropertyTypeClient extends HttpClient{
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

  public async getPropertyTypeByCode<T extends COTPropertyType>(code: string): Promise<T> {
    return (await this.instance.get(`/api/v2/propertyTypes/code/${code}`)).data
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

  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string): Promise<T[]>
  public async searchProperty<T extends COTProperty>(search: string, propertyType?: string, options?: searchPropertyQueryOptions)
  : Promise<T> {
    const query: Record<string, string|string[]> = { search, ...(options??{}) }
    if (propertyType) query.propertyTypes = propertyType
    return (await this.instance.get(`/api/v2/properties?${new URLSearchParams(query).toString()}`)).data?.properties ?? []
  }
} 
