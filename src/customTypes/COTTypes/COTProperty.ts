import { DateQueryParams, GenericQueryParams, ObjectId } from '@customTypes/custom'

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

export type PropertiesQueryParams = GenericQueryParams & 
DateQueryParams & {
  search?: string;
  propertyTypes?: string[];
  codes?: string[];
  'owner[$ref]'?: 'user' | 'task';
  'owner[$id]'?: ObjectId;
  ids?: ObjectId[];
  parent?: ObjectId;
  orderBy?:string;
  sortBy?: string;
  debug?: string;
}
