import { AbstractDecoratorAnalyse } from "./AbstractDecorator.analyse";
import { EntityMeta } from "../meta/Entity.meta";
import { AttributeMeta } from "../meta/Attribute.meta";

import { DecoratorManager } from "../DecoratorManager";

import { EntityDecoratorDefine } from "../metaStructure/EntityDecorator.define";
import { AttributeDecoratorDefine } from "../metaStructure/AttributeDecorator.define";

import { AttributeDecoratorAnalyse, ClassToAttributesType } from "./AttributeDecorator.analyse";

/**
 * @description 构造器到类装饰器实体结构映射
 * @type Map<Function, EntityDecoratorDefine>
 * @name classToEntity
 * @example
 *  @Entity
 *  class Person{}
 *  
 *  classToEntity :
 *      Person[function] : entityDecoratorDefine[instance of EntityDecoratorDefine]
 */
let classToEntity : Map<Function, EntityDecoratorDefine> = new Map();

/**
 * @description 构造器名称到构造器的映射
 * @type Map<string, Function>
 * @name nameToClass
 * @example
 *  @Entity({
 *      name : 'person'
 *  })
 *  class Person{}
 *  
 *  classNameToClass :
 *      'Person' : Person[function]
 *  nameToClass : 
 *      'person' : Person[function]
 */
let classNameToClass : Map<string, Function> = new Map();
/**
 * @description 别名到构造器的映射 元数据没有别名的在该集合中不存在
 */
let nameToClass : Map<string, Function> = new Map();


let metaMap : Map<string, Map<any, any>> = new Map();
let isInitMetaMap : boolean = false;


export type ClassToEntityType = Map<Function, EntityDecoratorDefine>;
export type NameToClassType = Map<string, Function>;
export type EntityMetaMapType = Map<string, Map<any, any>>;

type getMetaMapReturnType = ClassToEntityType | NameToClassType | EntityMetaMapType;


/**
 * @class EntityDecoratorAnalyse
 * @description Entity元数据类型 装饰分析器
 * @extends AbstractDecoratorAnalyse
 */
export class EntityDecoratorAnalyse extends AbstractDecoratorAnalyse{
    /**
     * @static
     * @property 装饰器在管理器中的标识
     * @type string
     */
    static DECORATOR_NAME : string = "EntityDecoratorAnalyse";
    /**
     * @static
     * @property 构造器到类装饰器实体结构映射标识
     * @type string
     */
    static CLASSTOENTITY_MAP_NAME : string = "EntityDecoratorAnalyse.classToEntity";
    /**
     * @static
     * @property 构造器名称到构造器的映射标识
     * @type string
     */
    static CLASSNAMETOCLASS_MAP_NAME : string = "EntityDecoratorAnalyse.classNameToClass";

    /**
     * @static
     * @property 名称到构造器的映射标志
     * @type string
     */
    static NAMETOCLAASS_MAP_NAME : string = "EntityDecoratorAnalyse.nameToClass";
    /**
     * @method isMeta
     * @param meta : EntityMeta | any
     * @description 判断是否为当前需要的元数据
     * @returns boolean
     */
    isMeta(meta :EntityMeta | any ) : meta is EntityMeta {
        return typeof meta !== 'function';
    }

    /**
     * @method initMetaMap
     * @description 初始化元数据实体结构映射结构
     */
    initMetaMap() : void{
        if( !isInitMetaMap ){
            metaMap.set( EntityDecoratorAnalyse.CLASSTOENTITY_MAP_NAME, classToEntity );
            metaMap.set( EntityDecoratorAnalyse.CLASSNAMETOCLASS_MAP_NAME, classNameToClass );
            metaMap.set( EntityDecoratorAnalyse.NAMETOCLAASS_MAP_NAME, nameToClass );
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
        return function( target : any | EntityMeta ){
            if( instance.isMeta( target ) ){  //有装饰器参数
                var meta = target;
                return function( target : any ) : void{
                    instance.analyseMeta( target, meta );
                }
            }
            instance.analyseMeta( target );
        }
     }

    /**
     * @method analyseMeta
     * @param target : Function 构造器
     * @param meta : EntityMeta 元数据
     * @description 在装饰器函数调用时进行分析和初始化映射结构
     */
    analyseMeta( target : Function, meta : EntityMeta = {} ) : void{
        var clazz : Function = target;  // 构造器
        var name : string = meta.name || clazz.name;   // 名称/查询时使用
        // 获取Entity元数据结构定义实例
        let entityDecoratorInstance = classToEntity.get( clazz );

        if( !entityDecoratorInstance ){
            entityDecoratorInstance = new EntityDecoratorDefine(
                name, clazz, meta.isWiredAll, {}, meta, clazz.name);
            // 设置映射关系
            classToEntity.set(clazz, entityDecoratorInstance);
            classNameToClass.set( clazz.name, clazz );   // 构造器名称和构造器之间的映射关系
            if( meta.name ){
                nameToClass.set( meta.name, clazz );
            }
        }
        
        // 获取Attribute分析器实例
        let attributeDecoratorAnalyseInstance = DecoratorManager.getDecoratorAnalyse<AttributeDecoratorAnalyse>( AttributeDecoratorAnalyse.DECORATOR_NAME );

        // 获取映射关系
        let classToAttributes = <ClassToAttributesType>attributeDecoratorAnalyseInstance.getMetaMap( AttributeDecoratorAnalyse.CLASSTOATTRIBUTES_MAP_NAME );

        // 获取构造器对应的属性元数据实体实例的数组
        let attributeDefineSet = classToAttributes.get( clazz );
        if( attributeDefineSet ){
            for( let attrInstance of attributeDefineSet ){
                entityDecoratorInstance.attrMap[ attrInstance.name ] = attrInstance;
            }
            attributeDefineSet.clear(); // 清空 来释放内存
        }
    }

    /**
     * @description 获取某个实体对应的全部attributeMetaDefine数组
     * @param analyseMetaDefine 实体元数据定义
     * @param attrMap 实体元数据定义上关联的属性元数据定义
     */
    getEntityAllAttribute(analyseMetaDefine:EntityDecoratorDefine, attrMap:{[name:string]:AttributeDecoratorDefine}):any{
        let attributeDefineArr :any[] = [];
        let entity = analyseMetaDefine.meta.extend;
        
        for(let key of Object.keys(attrMap)){
            attributeDefineArr.push({ name:key, value:attrMap[key] })
        }

        if( entity ){
            let clazz:string|Function;
            if( typeof entity === 'string' ){
                clazz = classNameToClass.get( entity ) || nameToClass.get( entity );
            }
            if( typeof clazz != 'function' ) throw new Error('clazz is not a class');

            let metaDefine = classToEntity.get( <Function>clazz );   // 元数据定义
            let attrMapMeta = metaDefine.attrMap;    // 属性元数据
            let result = this.getEntityAllAttribute( metaDefine,attrMapMeta );
            
            attributeDefineArr = attributeDefineArr.concat( result );
        }

        return attributeDefineArr;
    }

    /**
     * @description 获取实体的构造器
     * @param entity 
     */
    getEntityClass(entity : string|Function){
        let clazz:Function = <Function>entity;
        if( typeof entity === 'string' ){
            clazz = classNameToClass.get( entity ) || nameToClass.get( entity );
        }
        if( typeof clazz != 'function' ) throw new Error('clazz is not a class');
        return clazz;
    }

    /**
     * @description 解析过滤后的数据，供上层调用
     * @param records 过滤后的数据[数组]
     * @param entity 要装配的实体
     * @returns 装配后的数组
     */
    processRecord(records : any, entity:string|Function) : any {
        // console.info( records, entity );
        if( !records || !records.length )   return ;

        // 获取元数据和构造器
        // console.info( classNameToClass, classToEntity, nameToClass );
        
        let clazz:Function = this.getEntityClass( entity );

        let analyseMetaDefine = classToEntity.get( <Function>clazz );   // 元数据定义
        let entityMeta = analyseMetaDefine.meta;    // 元数据
        let attrMap = analyseMetaDefine.attrMap;    // 属性元数据

        // console.info( clazz, analyseMetaDefine );
        // 处理继承关系[可能是继承链]
        let processrAttrMap = this.getEntityAllAttribute( analyseMetaDefine, attrMap );
        
        let wiredRecords = [];
        for(let record of records){
            wiredRecords.push( this.autoWiredEntity( clazz, processrAttrMap, record ) );
        }
        // console.info( wiredRecords );
        return wiredRecords;
    }

    /**
     * @description 自动装配实体
     * @param clazz 构造器
     * @param 经过getEntityAllAttribute解析之后的属性数组
     * @param record 准备数据
     */
    autoWiredEntity(clazz:Function, processrAttrMap:any, record:any) : any{
        var instance = this.instantiate(clazz as {new( ...args:any[]):any});
        for(let attr of processrAttrMap){
            let proName = attr.name;    // 属性名
            let attrDefine : AttributeDecoratorDefine = attr.value; // 属性元数据定义
            if( !attrDefine.relatedEntity ){    // 非class或者array 则认为是处理原始数据
                let primaryCtor = AttributeDecoratorAnalyse.getPrimaryConstructor( attrDefine.type );
                if( record[ proName ] ){
                    try{
                        instance[ proName ] = this.instantiate(<{new( ...args:any[]):any}>primaryCtor, record[ proName ]);
                    }catch(error){
                        console.warn(proName + 'is not transfer');
                    }
                }
            }else{  // class | array
                if( attrDefine.type == 'class' ){   // @TODO 这个地方可能需要在进行一次属性分析
                    let analyseMetaDefine = classToEntity.get( <Function>attrDefine.relatedEntity );   // 元数据定义
                    let processrAttrMap = this.getEntityAllAttribute( analyseMetaDefine, analyseMetaDefine.attrMap );
                    
                    let attrInstance = this.autoWiredEntity(<Function>attrDefine.relatedEntity, processrAttrMap, record[ proName ] );
                    instance[ proName ] = attrInstance;
                    
                } else if( attrDefine.type == 'array' ){
                    let valueArr = record[ proName ];

                    if( Array.isArray( valueArr ) ){
                        instance[ proName ] = [];
                        for(let value of valueArr){
                            let analyseMetaDefine = classToEntity.get( <Function>attrDefine.relatedEntity );   // 元数据定义
                            if( analyseMetaDefine ){    // 自定义class
                                let processrAttrMap = this.getEntityAllAttribute( analyseMetaDefine, analyseMetaDefine.attrMap );
                                let attrInstance = this.autoWiredEntity(<Function>attrDefine.relatedEntity, processrAttrMap, value );
                                instance[ proName ].push( attrInstance );
                            }else{  // 否则认为是原生数据类型
                                let attrInstance = this.instantiate(<{new( ...args:any[]):any}>attrDefine.relatedEntity, value);
                                instance[ proName ].push( attrInstance );
                            }
                        }
                    }
                }else {
                    instance[ proName ] = record[ proName ];
                }
            }
        }
        return instance;
    }

    instantiate<T>( ctor : { new( ...args:any[]) : T }, ...args:any[] ) : T{
        return new ctor( ...args );
    }
}

// 注册分析器
DecoratorManager.registerDecoratorAnalyse( EntityDecoratorAnalyse.DECORATOR_NAME, new EntityDecoratorAnalyse );


