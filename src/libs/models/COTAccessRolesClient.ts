import { AccessRolesQueryParams, COTAccessRole } from '@customTypes/COTTypes/COTAccessRole'
import { QueryHandler } from '@utils/QueryHandler'
import { AxiosInstance } from 'axios'

export default class COTAccessRolesClient {
  protected readonly _instance: AxiosInstance

  private queryHandler

  
  public constructor(instance: AxiosInstance) {
    this._instance = instance
    this.queryHandler = new QueryHandler('accessroles', this._instance)
  }

  public async getAccessRoleQuery(query:AccessRolesQueryParams): Promise<COTAccessRole[]> {
    return (await this.queryHandler.getQuery(query)).accessRoles
  }

  public async getAllAccessRolesInQuery(query:AccessRolesQueryParams): Promise<COTAccessRole[]> {
    return this.queryHandler.getAllInQuery(query)
  }

  public async searchAccessRolesByName(search: string): Promise<COTAccessRole[]> {
    return this.getAccessRoleQuery({ search })
  }

  public async getAccessRoles(): Promise<COTAccessRole[]> {
    return (await this._instance.get('api/v2/accessroles?limit=100')).data
  }
}
