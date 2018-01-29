import { AbstractDecoratorAnalyse } from "./AbstractDecorator.analyse";
import { AttributeMeta } from "../meta/Attribute.meta";

import { AttributeDecoratorDefine } from "../metaStructure/AttributeDecorator.define";

import { DecoratorManager } from "../DecoratorManager";

import { EntityDecoratorAnalyse, ClassToEntityType, NameToClassType } from "./EntityDecorator.analyse";

/**
 * @description 构造器到属性的映射
 * @type Map<Function, Set<AttributeDecoratorDefine>>
 * @name classToAttributes
 * @example
 *  @Entity
 *  class Person{
 *      @Attribute()
 *      name : string;
 *      @Attribute()
 *      age : number;
 *  }
 *  
 *  classToAttributes :
 *      Person[function] : [ 
 *          name_attributeDecoratorDefine[instance of AttributeDecoratorDefine], 
 *          age_attributeDecoratorDefine[instance of AttributeDecoratorDefine], 
 *      ]
 */
let classToAttributes : Map<Function, Set<AttributeDecoratorDefine>> = new Map();

/**
 * 当前分析器全部的数据映射
 */
let metaMap : Map<string, Map<any, any>> = new Map();

/**
 * 是否初始化的标志
 */
let isInitMetaMap : boolean = false;


export type ClassToAttributesType = Map<Function, Set<AttributeDecoratorDefine>>;
export type AttributeMetaMapType = Map<string, Map<any, any>>;

/**
 * getMetaMap 返回类型
 */
type getMetaMapReturnType = ClassToAttributesType | AttributeMetaMapType;


/**
 * @class AttributeDecoratorAnalyse
 * @description Attribute元数据类型 装饰分析器
 * @extends AbstractDecoratorAnalyse
 */
export class AttributeDecoratorAnalyse extends AbstractDecoratorAnalyse{
    
    /**
     * @static
     * @property DECORATOR_NAME
     * @type string
     * @description 装饰管理器中的标识
     */
    static DECORATOR_NAME : string = "AttributeDecoratorAnalyse";

    /**
     * @static
     * @property CLASSTOATTRIBUTES_MAP_NAME
     * @description 构造器到属性的映射标识
     * @type string
     */
    static CLASSTOATTRIBUTES_MAP_NAME : string = "AttributeDecoratorAnalyse.nameToClass";
    
    isMeta(meta :AttributeMeta | any ) : meta is AttributeMeta {
        return typeof meta !== 'function';//静态成员则表示构造函数,实例成员是原型对象
    }
    
    /**
     * @method initMetaMap
     * @description 初始化元数据实体结构映射结构
     */
    initMetaMap() : void{
        if( !isInitMetaMap ){
            metaMap.set( AttributeDecoratorAnalyse.CLASSTOATTRIBUTES_MAP_NAME, classToAttributes );
            isInitMetaMap = true;
        }
    }

    /**
     * @method getMetaMap
     * @param name : string
     * @description 根据名称获取对应的映射结构
     */
    getMetaMap( name? : string ) : getMetaMapReturnType{
        return name ? metaMap.get( name ) : metaMap;
    }

    /**
     * @method getDecorator
     * @description  获取装饰器函数，在函数调用时，进行元数据的分析
     * @returns Function`
     */
    getDecorator() : Function{
        var instance = this;
        return function( target? : any | AttributeMeta, propertyKey? : string | symbol, descriptor? : Object ){
            if( instance.isMeta( target ) ){    // 只处理原型上属性->实例成员
                if( typeof propertyKey === "undefined" ){ // 有装饰器参数
                    var meta = target;
                    return function( target : any, propertyKey : string | symbol, descriptor : Object ){
                        // DecoratorManager.registerAttibute( target, propertyKey, descriptor, meta );
                        instance.analyseMeta( target, propertyKey, descriptor, meta )
                    }
                }else{  // 无装饰器参数
                    // DecoratorManager.registerAttibute( target, propertyKey, descriptor );
                    instance.analyseMeta( target, propertyKey, descriptor );
                }
            }
        }
    }


    // "string" | "boolean" | "number" | "null" | "undefined" | "date" | "regexp" | "class" | 'array'
    /**
     * @method getPrimaryConstructor
     * @param @type name
     * @returns @type Function
     * @description 根据传入的参数类型获取对应的构造函数
     */
    static getPrimaryConstructor( name:string ){
        switch( name ){
            case 'string' : return String;
            case 'boolean':
            case 'bool' : return Boolean;
            case 'number' : return Number;
            case 'date' : return Date;
            case 'regexp' : return RegExp;
            // case 'symbol'
            default : return new Function;
        }
    }

    /**
     * @method analyseMeta
     * @param target : any 构造函数原型对象
     * @param propertyKey : 属性名称
     * @param descriptor 属性描述符[经测试为undefined]
     * @param meta 属性元数据
     * @returns void
     * @description 在装饰器函数运行时对元数据的处理
     */
    analyseMeta( target : any, propertyKey : string | symbol, descriptor : Object, meta : AttributeMeta={} ) : void{
        // 构造函数
        let constructor : Function = target.constructor;
        // 根据装饰器标志获取Entity装饰分析器实例
        let entityDecoratorAnalyseInstance = DecoratorManager.getDecoratorAnalyse<EntityDecoratorAnalyse>( EntityDecoratorAnalyse.DECORATOR_NAME );
        
        // 获取构造器到Entity元数据实体结构定义的映射
        let classToEntity  = <ClassToEntityType>entityDecoratorAnalyseInstance.getMetaMap( EntityDecoratorAnalyse.CLASSTOENTITY_MAP_NAME );
        let classNameToClass = <NameToClassType>entityDecoratorAnalyseInstance.getMetaMap( EntityDecoratorAnalyse.CLASSNAMETOCLASS_MAP_NAME ); // 
        let nameToClass = <NameToClassType>entityDecoratorAnalyseInstance.getMetaMap( EntityDecoratorAnalyse.NAMETOCLAASS_MAP_NAME );
        
        // 根据构造器获取某个Entity元数据实体结构定义的实例
        let entityDecoratorDefine = classToEntity.get( constructor );

        // 分析参数部分
        var name = meta.name || propertyKey,    // 属性名
            alias = meta.alias || propertyKey,  // 别名
            relatedEntity = meta.relatedEntity || undefined,    // 关联实体
            autoWiredRelatedEntity = meta.autoWiredRelatedEntity,   // 是否处理关联的实体
            // type = meta.type || Reflect.getMetadata("design:type", target, propertyKey).name.toLowerCase(); // 属性的类型
            type = meta.type;
        
        if( type === 'class' || type === 'array' ){ // 如果关联着实体, 则需要把relatedEntity转化为对应的class
            let relatedEntityName;
            if( typeof relatedEntity === 'string' ){    // 有可能是构造器的名称|EntityMeta的别名
                relatedEntityName = relatedEntity;
                relatedEntity = classNameToClass.get( relatedEntity ) || nameToClass.get( relatedEntity );
            }
            
            // 数组 是字符串 且不是自定义实体
            if( (type === 'array') && typeof relatedEntityName==='string' && !relatedEntity ){   // 如果数组不是关联的实体类型 则处理内置的对象
                relatedEntity = AttributeDecoratorAnalyse.getPrimaryConstructor( relatedEntityName );
            }

            if( typeof relatedEntity !== 'function' ){
                throw Error('AttributeMeta.relatedEntity is not a class');
            }
        }
    

        if( !type ){    // type可能是内置的构造函数 或者是自定义的类
            let reflectType = Reflect.getMetadata("design:type", target, propertyKey);  // 如果注解在某个实体上，返回的是实体类
            // 查找名称在缓存中关联的实体，如果没有 就认为是普通js对象[日期、正则]
            if( classNameToClass.get( reflectType.name ) ){
                autoWiredRelatedEntity = true;
                relatedEntity = reflectType;
                type = "class";  // 标记为函数类型
            }else{
                type = reflectType.name.toLowerCase();
            }
        }
        
        
        // 实例化Attribute元数据实体结构
        let attributeDefine = new AttributeDecoratorDefine( name, type, relatedEntity, autoWiredRelatedEntity, alias as string );

        // TODO class代码后执行 导致 class到实体的关系没有
        if( entityDecoratorDefine ){    // 存在实体装饰器定义
            entityDecoratorDefine.attrMap[ name ] = attributeDefine;
        }else{  // 不存在 则表示@Entity装饰器还没有执行，避免数据丢失
            let attributeDefineSet = classToAttributes.get( constructor );
            if( !attributeDefineSet ){
                attributeDefineSet = new Set<AttributeDecoratorDefine>();
                classToAttributes.set( constructor, attributeDefineSet );
            }
            attributeDefineSet.add( attributeDefine );
        }
    };

}


DecoratorManager.registerDecoratorAnalyse( AttributeDecoratorAnalyse.DECORATOR_NAME, new AttributeDecoratorAnalyse );

