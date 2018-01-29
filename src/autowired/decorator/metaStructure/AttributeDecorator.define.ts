import { AbstractDecoratorDefine } from "./AbstractDecorator.define";

// 属性装饰器定义
export class AttributeDecoratorDefine extends AbstractDecoratorDefine{
    // 
    name? : string | symbol; // 属性名称, 没有取属性名称 [数据填充时使用, 优先, 唯一]
    alias? : string; // 别名 [同上]
    type? : string;  // typeof 类型
    relatedEntity? : string | Function;  // 引用的实体 名称or其构造函数
    autoWiredRelatedEntity? : boolean;   // 是否填充关联实体
    constructor( name : string | symbol, type : string, relatedEntity : string | Function, autoWiredRelatedEntity : boolean);
    constructor( name : string | symbol, type : string, relatedEntity : string | Function, autoWiredRelatedEntity : boolean, alias:string);
    constructor( name : string | symbol, type : string, relatedEntity? : string | Function, autoWiredRelatedEntity : boolean = true, alias? : string ){
        super();
        this.name = name;
        this.type = type;
        this.relatedEntity = relatedEntity;
        this.autoWiredRelatedEntity = autoWiredRelatedEntity;
        this.alias = alias;
    }
}