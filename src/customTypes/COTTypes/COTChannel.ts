import { ObjectId } from "../custom"

export declare interface COTChannel {
  _id: ObjectId
  group: ObjectId
  nameCode: string
  nameDisplay: string
  userIds: string[]
}

export declare type COTChannelPostBody = Omit<COTChannel,'_id'>