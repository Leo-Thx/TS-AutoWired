import { RequestCondition } from "./RequestCondition";

export interface IRequestCondition{
    /**
     * @method @abstract buildRequestCondition
     * @param condition @type RequestCondition
     * @returns void
     * @description 构造查询条件
     */
    buildRequestCondition(condition : RequestCondition) : void;
}