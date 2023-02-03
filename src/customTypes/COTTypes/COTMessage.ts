import { ObjectId } from '@customTypes/custom'

export interface SendMsgBody {
    channel: ObjectId;
    content: string;
    contentType: 'text/system' | 'text/plain';
    isSaved: 2;
    sentBy: ObjectId;
  }
