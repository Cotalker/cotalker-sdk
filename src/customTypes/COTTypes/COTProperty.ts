import { ObjectId } from '@customTypes/custom'

import { IsActiveOptions } from './APIGenerics'

export declare interface COTProperty {
  _id: ObjectId;
  subproperty: ObjectId[];
  name: { code: string; display: string };
  createdAt: string;
  modifiedAt: string;
  propertyType: string;
  extra?: Record<string, unknown>;
  schemaInstance?: Record<string, unknown>;
  owner?: Record<string, string>;
}

export interface SearchPropertyQueryOptions {
  parent?: string | string[];
}

export declare type COTPropertyQuery = {
  search?: string;
  limit?:number;
  page?:number;
  count?:boolean;
  orderBy?:string;
  sortBy?: string;
  ids?: ObjectId[] | ObjectId;
  parent?: ObjectId[] | ObjectId;
  propertyTypes?: string[] | string;
  codes?: string[] | string;
  isActive?: IsActiveOptions;
  //owner?:string;
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

export declare type Owner = {
  ref?: string;
  id?: ObjectId;
  db?: string;
}
