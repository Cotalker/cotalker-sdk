import { ObjectId } from '@customTypes/custom'

export type SendMsgBody = {
  channel: ObjectId,
  content?: string,
  contentParts?: COTMessageContentPart[],
  contentType: 'text/system' | 'text/plain' | 'text/enriched',
  isSaved: 2,
  sentBy: ObjectId
} 

export type EditMsgBody = {
  channel: ObjectId,
  content: string,
  isSaved: 2,
} 

// export type SendEnrichedMsgBody = {
//   channel: ObjectId;
//   contentType: 'text/enriched';
//   isSaved: 2;
//   sentBy: ObjectId;
//   contentParts?: COTMessageContentPart[];
// }

export type COTMessageContentPart = {
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

export type COTMessageContentPartHoverPayload = {
  html?: string;
  markdown?: string;
  card?: {
    text: string;
    image: string;
  };
}


export type COTMessageContentPartLinkPayload = {
  url: string;
  ogMetadata: COTOpengraphMetadata;
}

export type COTMessageContentPartTaskPayload = {
  company: string;
  task: string;
  taskGroup: string;
}

export type COTMessageContentPartUserPayload = {
  company: string;
  user: string;
}

export type COTOpengraphMetadata = {
  title: string;
  url: string;
  image: string;
  description: string;
  siteName: string;
  video: string;
  audio: string;
  logo: string;
  date: string;
  author: string;
}
