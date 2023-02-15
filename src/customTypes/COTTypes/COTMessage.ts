import { ObjectId } from '@customTypes/custom'

export type SendMsgBody = {
  channel: ObjectId,
  content: string,
  contentType: 'text/system' | 'text/plain',
  isSaved: 2,
  sentBy: ObjectId
} 

export type EditMsgBody = {
  channel: ObjectId,
  content: string,
  isSaved: 16,
} 

export type RmMsgBody = {
  isHidden: true
} 

export interface SendEnrichedMsgBody {
  channel: ObjectId;
  contentType: 'text/enriched';
  isSaved: 16;
  sentBy: ObjectId;
  contentParts?: COTMessageContentPart[];
}

export interface COTMessageContentPart {
  type: COTMessageContentPartType;
  content: string;
  payload:
  never |
  COTMessageContentPartHoverPayload |
  COTMessageContentPartLinkPayload |
  COTMessageContentPartTaskPayload |
  COTMessageContentPartUserPayload;
}

export enum COTMessageContentPartType {
  Text = 'text',
  Hover = 'hover',
  Link = 'link',
  Task = 'task',
  User = 'user',
}

export interface COTMessageContentPartHoverPayload {
  html?: string;
  markdown?: string;
  card?: {
    text: string;
    image: string;
  };
}


export interface COTMessageContentPartLinkPayload {
  url: string;
  ogMetadata: COTOpengraphMetadata;
}

export interface COTMessageContentPartTaskPayload {
  company: string;
  task: string;
  taskGroup: string;
}

export interface COTMessageContentPartUserPayload {
  company: string;
  user: string;
}

export interface COTOpengraphMetadata {
  title: string;
  url: string;
  image: string;
  description: string;
  siteName: string;
  video: string;
  audio: string;
  logo: string;
  date: Date;
  author: string;
}
