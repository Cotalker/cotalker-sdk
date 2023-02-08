import { COTQueryResult, ElementsOptions, QueryElements, QueryType } from '@customTypes/COTTypes/APIGenerics'
import { AxiosInstance } from 'axios'
import * as querystring from 'querystring'

export class ElementQuery { 
  protected readonly instance: AxiosInstance
  
  private query: QueryType
  
  private elements: ElementsOptions
  
  public constructor(_query: QueryType, _elements: ElementsOptions, _instance:AxiosInstance) {
    this.instance = _instance
    this.elements = _elements
    this.query = _query   
  }

  public async getQuery(): Promise<COTQueryResult> {
    this.query.count = true
    this.query.limit = 100
    const response = (await this.instance.get<{ data: { count: number; elements: QueryElements[] } }>(`/api/v2/${this.elements}?${querystring.encode(this.query)}`))?.data
    let result: COTQueryResult
    result.count = response?.count
    result.elements = response?.elements
    return result
  }

  public async getAllElementsByQuery(): Promise<QueryElements[]>  {
    let count = 1
    this.query.isActive = 'true'
    this.query.page = 1
    const elements: QueryElements[] = []
    do {
      const response = this.getQuery()
      elements.push(...(await response).elements)
      count = (await response).count
      this.query.page += 1
    } while (elements.length < count)
    return elements
  }
}
