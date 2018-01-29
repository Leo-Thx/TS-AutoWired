import { Projection } from "./Projection.interface";

import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

import { IRequestCondition } from "../IRequestCondition";
import { IDataProcessor } from "../IDataProcessor";

/**
 * @class @abstract SimpleProjection
 * @description 用于聚合、单个属性值的匹配、行统计基类
 *  --RowCountProjection    统计行
 *  --AggregateProjection   标准聚合函数
 *  --PropertyProjection    某个字段属性过滤
 * @extends Projection
 * @TODO 缺失对数据进行操作，可能需要构造一个结构集数据结构
 */
export abstract class SimpleProjection extends Projection implements IRequestCondition, IDataProcessor{
    /**
     * @method isGrouped
     * @description 默认对返回的值不进行分组
     * @returns boolean 
     * @default false
     */
    isGrouped() : boolean{
        return false;
    }


    /**
     * @method @abstract buildRequestCondition
     * @param condition @type RequestCondition
     * @returns void
     * @description 构造查询条件
     */
    abstract buildRequestCondition(condition : RequestCondition) : void;

    
    /**
     * @method @abstract dataProcessor
     * @param condition @type RequestCondition 数据集
     * @returns @type FilteredRecords 操作之后的数据
     * @description 当前实例对数据集合进行的筛选操作，供上层接口调用，由子类实现
     */
    abstract dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords;
}