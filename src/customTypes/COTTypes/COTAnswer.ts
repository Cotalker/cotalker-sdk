import { GenericQueryParams, ObjectId } from '@customTypes/custom'

import { COTQuestionContentType } from './COTQuestion'

export declare interface COTAnswerData {
  code: string[];
  identifier: string;
  contentType: COTQuestionContentType;
  process: string[];
  responses: string[];
  group: string;
  user: ObjectId;
}
export declare interface COTAnswer {
  _id: ObjectId;
  uuid: string;
  channel: ObjectId;
  user: ObjectId;
  properties: ObjectId[];
  propertyTypes: string[];
  identifiersNeeded: string[];
  extendsAnswer: ObjectId[];
  rExtendsAnswer: ObjectId[];
  data: COTAnswerData[];
  createdAt: string;
  modifiedAt: string;

  score: {
    main: number;
    scores: {
      key: string;
      value: unknown;
    }[];
  };
}


export type AnswersQueryParams = GenericQueryParams & {
  extra?: string[];
  user?: ObjectId;
  survey?: ObjectId;
  surveyIds?: ObjectId;
  properties?: ObjectId;
  answerUuids?: ObjectId;
  fullMatchProperties?: boolean;
  modifiedAtGte?: string;
  modifiedAtLte?: string;
  search?: string;
  orderBy?:string;
  sortBy?: string;
  debug?: 'true'
}

