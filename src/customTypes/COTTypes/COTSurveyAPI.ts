import { ObjectId } from '@customTypes/custom'
/* 
Debiese haber un tipo general para el survey, api o no? Es una idea nada mas, no esta implementado.
*/
export declare type SurveyAPI = {
    _id: ObjectId
    code: ObjectId | string
    display: string
    subproperties: object[] | ObjectId | string
}