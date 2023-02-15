import { DateQueryParams, GenericQueryParams, ObjectId } from '@customTypes/custom'

export declare interface COTChannel {
  _id: ObjectId;
  group: ObjectId;
  nameCode: string;
  nameDisplay: string;
  userIds: string[];
}


export declare type ChannelsQueryParams = GenericQueryParams &
DateQueryParams & {
  search?: string;
  orderBy?:string;
  sortBy?: string;
  group?: ObjectId; 
  user?: ObjectId;
  userIsAdmin?: boolean;
  directChannels?: string;
  debug?: boolean;
}
