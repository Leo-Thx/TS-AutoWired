import { EntityDecoratorDefine } from "./metaStructure/EntityDecorator.define";
import { AttributeDecoratorDefine } from "./metaStructure/AttributeDecorator.define";

import { EntityMeta } from "./meta/Entity.meta";
import { AttributeMeta } from "./meta/Attribute.meta";

import { EntityDecoratorAnalyse } from "./metaAnalyse/EntityDecorator.analyse";
import { AttributeMetaMapType } from "./metaAnalyse/AttributeDecorator.analyse";
import { AbstractDecoratorAnalyse } from "./metaAnalyse/AbstractDecorator.analyse";

import * as ReflectAlias from "reflect-metadata";

/*
// 构造器到类装饰器实体结构映射
let classToEntity : Map<Function, EntityDecoratorDefine> = new Map();
// 名称到构造器的映射
let nameToClass : Map<string, Function> = new Map();

// 属性到构造器的映射
// Function : Array<attr>
let classToAttributes : Map<Function, Set<AttributeDecoratorDefine>> = new Map();
*/

// 装饰分析器映射[ 初始化时注册 ]
let decoratorMap : Map<string, AbstractDecoratorAnalyse> = new Map();

export const DecoratorManager = {
    /*
    registerClass( target : Function, meta : EntityMeta = {} ){
        var clazz : Function = target;  // 构造器
        var name : string = meta.name || clazz.name;   // 名称/查询时使用
        let entityDecoratorInstance = classToEntity.get( clazz );

        if( !entityDecoratorInstance ){
            entityDecoratorInstance = new EntityDecoratorDefine(
                name, clazz, meta.isWiredAll, [], meta, clazz.name);
            
            classToEntity.set(clazz, entityDecoratorInstance);
            nameToClass.set( name, clazz );
        }
        
        // 设置实体关联的属性
        let attributeDefineSet = classToAttributes.get( clazz );
        if( attributeDefineSet ){
            for( let attrInstance of attributeDefineSet ){
                entityDecoratorInstance.attrMap[ attrInstance.name ] = attrInstance;
            }
            attributeDefineSet.clear();
        }
    },
    registerAttibute( target : any, propertyKey : string | symbol, descriptor : Object, meta : AttributeMeta={} ){
        let constructor : Function = target.constructor;
        let entityDecoratorDefine = classToEntity.get( constructor );

        var name = meta.name || propertyKey,
            alias = meta.alias || propertyKey,
            relatedEntity = meta.relatedEntity || undefined,
            autoWiredRelatedEntity = meta.autoWiredRelatedEntity,
            type = meta.type || Reflect.getMetadata("design:type", target, propertyKey).name.toLowerCase();
        
        let attributeDefine = new AttributeDecoratorDefine( name, type, relatedEntity, autoWiredRelatedEntity );

        // TODO class代码后执行 -> 重做映射关系
        if( entityDecoratorDefine ){    // 存在实体装饰器定义
            entityDecoratorDefine.attrMap[ name ] = attributeDefine;
        }else{  // 不存在
            let attributeDefineSet = classToAttributes.get( constructor );
            if( !attributeDefineSet ){
                attributeDefineSet = new Set<AttributeDecoratorDefine>();
                classToAttributes.set( constructor, attributeDefineSet );
            }
            attributeDefineSet.add( attributeDefine );
        }
    },
    */
    registerDecoratorAnalyse<T extends AbstractDecoratorAnalyse>( name:string, analyse : T ) : void{
        if( !decoratorMap.get( name ) ){
            decoratorMap.set( name, analyse );
            analyse.initMetaMap();
        }
    },

    getDecoratorAnalyse<T extends AbstractDecoratorAnalyse>(name : string) : T{
        return decoratorMap.get( name ) as T;
    }
};