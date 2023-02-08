import { COTProperty, COTPropertyQuery } from './COTProperty'
import { COTPropertyType, COTPropertyTypeQuery } from './COTPropertyType'
import { COTUser, COTUserQuery } from './COTUser'

export type IsActiveOptions = 'true' | 'false' | 'all'

export type JSONPatchBody = {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: `/${string}`;
  value?: unknown;
}[]

export declare interface COTQueryResult {
  count: number;
  elements: QueryElements[] ;
}

export type ElementsOptions = 'users' | 'properties' | 'propertyTypes'

export type QueryType = COTUserQuery | COTPropertyQuery | COTPropertyTypeQuery

export type QueryElements = COTUser | COTProperty | COTPropertyType
