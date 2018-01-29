import { SimpleProjection } from "./SimpleProjection.projection";
import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

/**
 * @description 聚合：标准集合函数的基类
 * @class AggregateProjection
 * @extends SimpleProjection
 */
export class AggregateProjection extends SimpleProjection{
    /**
     * @property propertyName
     * @description    聚合函数执行时，要聚合的属性字段
     * @type string
     */
    protected propertyName : string;
    
    /**
     * @description 要执行的聚合函数
     *  MAX、MIN、SUM、AVG、COUNT 具体由子类进行实现
     * @type string
     * @property functionName
     */
    protected functionName : string;

    /**
     * @property enumFunction
     * @type enum
     * @description 聚合函数枚举常量[数字]
     */
    protected enumFunction : AggregateProjection.AggregateFunction;

    /**
     * @method constructor
     * @description 构造函数 对枚举过来的常量 会转为对应大写的字符串
     * @param propertyName 聚合的属性名
     * @param enumFunction 枚举常量
     */
    constructor(propertyName : string, enumFunction:AggregateProjection.AggregateFunction){
        super();
        this.propertyName = propertyName;
        this.enumFunction = enumFunction;
        this.functionName = AggregateProjection.AggregateFunction[ enumFunction ];
    }

    protected getFunctionName() : string{ return this.functionName; }
    protected getPropertyName() : string{ return this.propertyName; }


    /**
     * @override
     */
    buildRequestCondition( condition : RequestCondition ) : RequestCondition{
        condition.addAggregation( this.getFunctionName(), this.getPropertyName() );
        return condition;
    }
    
    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let aggregates = filteredRecords.requestCondition.aggregation;
        for(let key of Object.keys( aggregates )){
            switch( key ){
                case AggregateProjection.AggregateFunction[ AggregateProjection.AggregateFunction.MAX ] : 
                    filteredRecords.aggregation[ key ] = this.handleSimpleAggregateValue( filteredRecords.records, aggregates[ key ], function(currentValue, nextValue){
                        return currentValue > nextValue ? currentValue : nextValue;
                    });
                    break;
                case AggregateProjection.AggregateFunction[ AggregateProjection.AggregateFunction.MIN ] : 
                    filteredRecords.aggregation[ key ] = this.handleSimpleAggregateValue( filteredRecords.records, aggregates[ key ], function(currentValue, nextValue){
                        return currentValue < nextValue ? currentValue : nextValue;
                    });
                    break;
                case AggregateProjection.AggregateFunction[ AggregateProjection.AggregateFunction.AVG ] : 
                case AggregateProjection.AggregateFunction[ AggregateProjection.AggregateFunction.SUM ] : 
                    filteredRecords.aggregation[ key ] = this.handleSimpleAggregateValue( filteredRecords.records, aggregates[ key ], function(currentValue, nextValue){
                        currentValue = Number.parseFloat( currentValue );
                        currentValue = Number.isNaN( currentValue ) ? 0 : currentValue;

                        nextValue = Number.parseFloat( nextValue );
                        nextValue = Number.isNaN( nextValue ) ? 0 : nextValue;

                        return currentValue + nextValue;
                    });
                    if( key == AggregateProjection.AggregateFunction[ AggregateProjection.AggregateFunction.AVG ] ){
                        for( let _data of filteredRecords.aggregation[ key ] ){
                            _data.value = _data.value / filteredRecords.records.length;
                        }
                    }
                    break;
            }
        }
        return filteredRecords;
    }

    handleSimpleAggregateValue(records:any, aggregates:string[], callback:(current:any, next:any)=>any):any{
        var tempValue = 0;
        let aggregate : {propertyName : string, value : any};
        let aggregateArr : {propertyName : string, value : any}[] = [];

        for( let propertyName of aggregates ){   // 
            for( let record of records ){   // 经过Expression之后的记录项
                tempValue = callback( tempValue, record[ propertyName ]);
            }
            aggregate = {} as {propertyName : string, value : any};
            aggregate.propertyName = propertyName;
            aggregate.value = tempValue;
            aggregateArr.push( aggregate );
        }

        return aggregateArr;
    }

}


export namespace AggregateProjection{
    /**
     * @description 聚合函数枚举常量
     * @type enum
     */
    export enum AggregateFunction{
        MAX,    // 对字段属性进行求取最大值
        MIN,    // ....最小值
        SUM,    // ....求和
        AVG,    // ....平均值
        COUNT   // ....统计个数，用于分组
    }
}