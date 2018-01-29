import { Projection } from "./Projection.interface";
import { AggregateProjection } from "./Aggregate.projection";
import { CountProjection } from "./Count.projection";
import { PropertyProjection } from "./PropertyProjection.projection";
import { ProjectionList } from "./ProjectionList.projection";
import { RowCountProjection } from "./RowCount.projection";
import { AvgProjection } from "./Avg.projection";

/**
 * @description 生成查询Projection实例的静态工厂
 * @class Projections 不能实例化
 */
export class Projections{
    private constructor(){ throw ("cannot be instantiated"); }

    /**
     * @static @method avg
     * @param propertyName @type string 字段属性名
     * @returns AggregateProjection
     * @description 生成某个字段属性求平均值的聚合函数
     */
    static avg(propertyName:string) : AggregateProjection{
        return new AvgProjection( propertyName );
    }

    /**
     * @static @method count
     * @param propertyName @type string 字段属性名
     * @returns CountProjection
     * @description 对某个字段属性进行统计的聚合函数
     */
    static count(propertyName : string) : CountProjection{
        return new CountProjection( propertyName );
    }

    /**
     * @static @method max
     * @param propertyName @type string 字段属性名
     * @returns AggregateProjection
     * @description 求取某个字段属性的最大值的聚合函数
     */
    static max(propertyName : string) : AggregateProjection{ 
        return new AggregateProjection( propertyName, AggregateProjection.AggregateFunction.MAX );
    }
    
    /**
     * @static @method min
     * @param propertyName @type string 字段属性名
     * @returns AggregateProjection
     * @description 求取某个字段属性的最小值的聚合函数
     */
    static min(propertyName : string) : AggregateProjection{
        return new AggregateProjection( propertyName, AggregateProjection.AggregateFunction.MIN );
    }

    /**
     * @static @method projectionList
     * @returns ProjectionList
     * @description 生成一个新的投影集合对象
     */
    static projectionList() : ProjectionList{ 
        return new ProjectionList();
    }

    /**
     * @static @method groupProperty
     * @param propertyName @type string 字段属性名
     * @returns PropertyProjection
     * @description 根据某个属性字段进行分组的属性字段投影实例
     */
    static groupProperty(propertyName : string) : PropertyProjection{
        return new PropertyProjection( propertyName, true );
    }

    /**
     * @static @method groupProperty
     * @param propertyName @type string 字段属性名
     * @returns PropertyProjection
     * @description 属性字段投影实例，不进行分组
     */
    static property(propertyName:string) : PropertyProjection{
        return new PropertyProjection( propertyName );
    }

    /**
     * @static @method rowCount
     * @returns Projection
     * @description 进行行统计
     */
    static rowCount() : Projection{
        return new RowCountProjection();
    }

    /**
     * @static @method sum
     * @param propertyName @type string 字段属性名
     * @returns AggregateProjection
     * @description 对某个字段属性进行进行求和聚合函数
     */
    static sum(propertyName : string) : AggregateProjection{ 
        return new AggregateProjection( propertyName, AggregateProjection.AggregateFunction.SUM );
    }
}
