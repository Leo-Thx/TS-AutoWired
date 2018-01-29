import { AbstractDecoratorDefine } from "./AbstractDecorator.define";
import { AttributeDecoratorDefine } from "./AttributeDecorator.define";

import { EntityMeta } from "../meta/Entity.meta";

// 实体装饰器定义
export class EntityDecoratorDefine extends AbstractDecoratorDefine{
    name : string; // 名字[构造查询时时取值]
    constructorName : string; // 构造器名称
    extend : string | Function;
    ctor : Function;    // 构造器
    attrMap : { [ name:string ] : AttributeDecoratorDefine };// 当前类含有的属性
    isWiredAll : boolean; // 是否全部装配
    meta : EntityMeta; // 元数据
    constructor( name:string, ctor:Function, isWiredAll:boolean = true, attrMap = {}, meta:any, constructorName?:string, extend?:any ){
        super();
        this.name = name || ctor.name;
        this.ctor = ctor;
        this.attrMap = attrMap;
        this.isWiredAll = isWiredAll;
        this.meta = meta;
        this.constructorName = constructorName || ctor.name;
        this.extend = extend || meta.extend;
    }
}
