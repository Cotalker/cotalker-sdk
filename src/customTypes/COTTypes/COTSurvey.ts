import { ObjectId } from "@customTypes/custom"

export declare interface COTSurvey {
  chat: QuestionChat[]
  _id: ObjectId
  code: String
}

export declare interface QuestionChat {
  contentArray: Question[]
  isActive: boolean
}

export declare interface Question {
  identifier: string,
  display: string[]
  contentType: string
  code: string
}