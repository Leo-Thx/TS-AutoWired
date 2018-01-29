import { AbstractMeta } from "./Abstract.meta";


export interface AttributeMeta extends AbstractMeta{
    name? : string | symbol;
    alias? : string; // 别名
    // 暂时Reflect无法处理泛型部分 只能用字符串代替
    type? : "string" | "boolean" | "number" | "null" | "undefined" | "date" | "regexp" | "class" | 'array';  // typeof 类型
    relatedEntity? : string | Function;
    autoWiredRelatedEntity? : boolean;
}


export enum AttributeType{
    boolean,
    number,
    string,
    any,
    undefined,
    null
}