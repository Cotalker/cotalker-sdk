import { GenericQueryParams, ObjectId } from '@customTypes/custom'


export declare interface COTAccessRole {
  _id: ObjectId;
  active: boolean;
  permissions: string[];
  name: string;
  description: string;
  company: ObjectId;
}

export type AccessRolesQueryParams = GenericQueryParams & {
  ids?: ObjectId;
  search?: string;
  debug?: string;
}
