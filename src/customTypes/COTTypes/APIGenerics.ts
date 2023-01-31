export type isActiveOptions = 'true'|'false'|'all'  //archiuvo apigenerics.ts

export type JSONPatchBody = {
  op: 'add'|'remove'|'replace'|'move'|'copy'|'test'
  path: `/${string}`, value?: unknown
}[]  //apigenerics
