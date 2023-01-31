import { ObjectId } from "@customTypes/custom"

export declare interface ScheduleBody {
  code: string; owner: string;
  priority?: number; timeoutMinutes?: number
  runVersion?: 'v1' | 'v2' | 'v3'
  execPath: string
  body?: ScheduleBotBody
  time?: Date
}

type botNext =
  Record<'DEFAULT',string>|
  Record<'SUCCESS'|'ERROR',string>|
  Record<'CREATED'|'NOT-CREATED',string>|
  Record<'STEP'|'DONE',string>
declare type botStage = {
  name: string
  key: string
  data: Record<string, unknown>
  next: botNext
}

export interface SchedulePostResponse {
  _id: ObjectId
}

export declare interface ScheduleBotBody {
  start: string
  version: 1 | 2 | 3
  maxIterations: number,
  stages: botStage[]
  data: Record<string, unknown>
}