import { ObjectId } from '@customTypes/custom'

export declare interface COTChannel {
  _id: ObjectId;
  group: ObjectId;
  nameCode: string;
  nameDisplay: string;
  userIds: string[];
}
