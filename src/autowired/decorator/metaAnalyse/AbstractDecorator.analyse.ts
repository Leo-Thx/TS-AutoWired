import { AbstractMeta } from "../meta/Abstract.meta";

/**
 * @class AbstractDecoratorAnalyse
 * @description 抽象元数据分析基类
 *  1. 获取装饰器
 *  2. 在数据装配时进行分析
 *  3. 处理装饰器元数据的映射关系 [映射关系由子类自己维护]
 */
export abstract class AbstractDecoratorAnalyse{
    /**
     * @method isMeta
     * @param meta 元数据或其他
     * @returns boolean
     * @description 判断当前元数据是否是某个装饰分析器的所需要的
     */
    abstract isMeta( meta : AbstractMeta | any ) : meta is AbstractMeta;
    
    /**
     * @method getDecorator
     * @returns Function
     * @description 获取对应的装饰器函数
     */
    abstract getDecorator() : Function;

    /**
     * @method initMetaMap
     * @description 初始化映射数据结构
     */
    abstract initMetaMap() : void;

    /**
     * @method getMetaMap
     * @param name 映射的名称
     * @returns any
     * @description 根据名字获取元数据映射结构
     */
    abstract getMetaMap( name? : string) : any;

}

