import { ObjectId } from '@customTypes/custom'

import { IsActiveOptions } from './APIGenerics'

export declare interface COTPropertyType {
  _id: ObjectId;
  code: string;
  company: string;
  createdAt: string;
  isActive: boolean;
  modifiedAt: string;
  display: string;
  schemaNodes: COTPropertyTypeSchemaNode[];
  viewPermissions: string[];
}

export declare interface COTPropertyTypeSchemaNode {
  validators: COTPropertyTypeValidator;
  isArray: boolean;
  weight: number;
  isActive: boolean;
  key: string;
  display: string;
  description: string;
  basicType: string;
  subType: string;
}

export declare interface COTPropertyTypeValidator {
  required: boolean;
}

export declare type COTPropertyTypeQuery = {
  search?: string;
  limit?:number;
  page?:number;
  count?:boolean;
  orderBy?:string;
  sortBy?: string;
  ids?: ObjectId[] | ObjectId;
  codes?: string[] | string;
  isActive?: IsActiveOptions;
  viewPermissions?: boolean;
  modified?: string; 
  modified_gt?: string;
  modified_gte?: string;
  modified_lt?: string;
  modified_lte?: string;
  created?: string;
  created_gt?: string;
  creatd_gte?: string;
  created_lt?: string;
  created_lte?: string;
  debug?: boolean;
}
