import { GenericQueryParams, ObjectId } from '@customTypes/custom'

export declare interface COTSurvey {
  chat: QuestionChat[];
  _id: ObjectId;
  code: string;
}

export declare interface QuestionChat {
  contentArray: Question[];
  isActive: boolean;
}

export declare interface Question {
  identifier: string;
  display: string[];
  contentType: string;
  code: string;
}

export type SurveysQueryParams = GenericQueryParams & {
  search?: string;
  answer?: string[];
  select?: string[];
  debug?: string;
}
