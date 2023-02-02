import { ObjectId } from '@customTypes/custom'
/* 
A general kind of Survey may be needed? Not implemented.
*/
export declare type SurveyAPI = {
    _id: ObjectId
    code: ObjectId | string
    display: string
    subproperties: object[] | ObjectId | string
}
