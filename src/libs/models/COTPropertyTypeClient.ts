import { URLSearchParams } from 'url'
import { ObjectId } from '@customTypes/custom'
import { COTPropertyType } from '@customTypes/COTTypes/COTPropertyType'
import { COTProperty, searchPropertyQueryOptions } from '@customTypes/COTTypes/COTProperty'
import { AxiosInstance } from 'axios'

export default class COTPropertyTypeClient {
  protected readonly _instance: AxiosInstance

  public constructor(instance: AxiosInstance) {
    this._instance = instance
  }

  public async getPropertyTypeByCode<T extends COTPropertyType>(code: string): Promise<T> {
    return (await this._instance.get(`/api/v2/propertyTypes/code/${code}`)).data
  }

  public async getAllFromPropertyType<T extends COTProperty>(propertyType: string): Promise <T[]> {
    let count = 1
    let page = 1
    const properties: T[] = []
    do {
      const response = (await this._instance.get<{ data: { count: number; properties: T[] } }>(
        `/api/v2/properties?page=${page}&propertyTypes=${propertyType}&limit=100&isActive=true&count=true`,
      ))
      properties.push(...(response.data?.properties ?? []))
      count = response.data?.count ?? properties.length
      page += 1
    } while (properties.length < count)
    return properties
  }

  public async getExtensionProperty<T extends COTProperty>(taskId: ObjectId, extensionKey: string) {
    const { data } = (await this._instance.get<{ data: T }>(`/api/v2/properties?propertyTypes=${extensionKey}&search=${taskId}`))
    if (Array.isArray(data) && data[0]) return data[0]
    throw new Error('Oops. Something went wrong')
  }

  public async searchProperty<T extends COTProperty>(
    search: string,
    propertyType?: string,
    options?: searchPropertyQueryOptions,
  ): Promise<T> {
    const query: Record<string, string | string[]> = { search, ...(options ?? {}) }
    if (propertyType) query.propertyTypes = propertyType
    return (await this._instance.get(`/api/v2/properties?${new URLSearchParams(query).toString()}`)).data?.properties ?? []
  }
}
