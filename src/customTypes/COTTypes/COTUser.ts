import { ObjectId } from '@customTypes/custom'

import { IsActiveOptions } from './APIGenerics'

export declare interface COTUser {
  _id: ObjectId;
  accessRoles: ObjectId[];
  avatar: Avatar;
  badge: any[];
  companies: Company[];
  createdAt: string;
  devices: Devices;
  email: string;
  emailIsVerified: boolean;
  extra: Extra;
  hierarchyLevel: string;
  isActive: boolean;
  isOnline: boolean;
  isPhoneVerified: boolean;
  job: ObjectId;
  jobTitle: string;
  lastRequestDate: string;
  messagesUnread: any[];
  modifiedAt: string;
  name: Name;
  needPasswordChange: boolean;
  notifications: Notifications;
  permissions: any[];
  phone: string;
  profileInfo: any[];
  properties: ObjectId[];
  provider: string;
  requiredChanges: any[];
  role: string;
  search: string[];
  settings: Settings;
  taskManager: boolean;
  termsConditions: boolean;
  extensions: Record<string, any>;
  permissionsV2: string[];
}

interface Settings {
  hideSummary: boolean;
  hideContacts: boolean;
}

interface Notifications {
  turnOffChannel: any[];
  turnOffGroup: any[];
  work: Work[];
  general: string;
}

interface Work {
  day: string;
  active: boolean;
  start: string;
  end: string;
}

interface Name {
  secondLastName: string;
  lastName: string;
  names: string;
  displayName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Extra {
}

interface Devices {
  iphone: any[];
  android: any[];
  web: boolean;
  web2?: any;
}

interface Company {
  companyId: string;
  _id: string;
  hierarchy: Hierarchy;
}

interface Hierarchy {
  subordinate: any[];
  peers: any[];
  boss: any[];
}

interface Avatar {
  small: string;
  original: string;
  square: string;
}

export declare type COTUserQuery = {
  search?: string;
  limit?:number;
  page?:number;
  count?:boolean;
  orderBy?:string;
  sortBy?: string;
  isActive?: IsActiveOptions;
  email?: string[] | string;
  bot?: ObjectId;
  id?: ObjectId;
  relatedUser?: ObjectId;
  property?: ObjectId;
  accessRole?: ObjectId;
  job?: string;
  modified?: string; 
  modified_gt?: string;
  modified_gte?: string;
  created?: string;
  created_gt?: string;
  creatd_gte?: string;
  created_lt?: string;
  created_lte?: string;
  debug?: boolean;
}

export declare interface COTUserQueryResult {
  count: number;
  users: COTUser[];
}

export declare interface COTUserActivity {
  date: string;
  customStatus?: COTUserActivityCustomStatus;
  connectionStatus: COTUserActivityConnectionStatus;
}

export declare interface COTUserActivityCustomStatus {
  display?: string;
  durationMinutes?: string;
  start?: string;
  type?: string;
  end?: string;
}

export declare interface COTUserActivityConnectionStatus {
  online?: boolean;
  lastOnline?: string;
}
