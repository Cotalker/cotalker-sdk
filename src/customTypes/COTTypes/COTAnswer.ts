import { COTQuestionContentType } from './COTQuestion'
import { ObjectId } from '@customTypes/custom'

export declare type COTAnswerData = {
  code: string[]
  identifier: string
  contentType: COTQuestionContentType
  process: string[]
  responses: string[]
  group: string
  user: ObjectId
}
export declare interface COTAnswer {
  _id: ObjectId
  uuid: string
  channel: ObjectId
  user: ObjectId
  properties: ObjectId[]
  propertyTypes: string[]
  identifiersNeeded: string[]
  extendsAnswer: ObjectId[]
  rExtendsAnswer: ObjectId[]
  data: COTAnswerData[]
  createdAt: string
  modifiedAt: string

  score: {
    main: number,
    scores: {
      key: string,
      value: unknown,
    }[]
  }
}
