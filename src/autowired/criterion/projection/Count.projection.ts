import { AggregateProjection } from "./Aggregate.projection";
import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

/**
 * @class CountProjection
 * @description 对某个字段进行统计
 */
export class CountProjection extends AggregateProjection{

    /**
     * @property distinct
     * @description 是否结果集中相同的属性进行合并统计
     */
    public distinct : boolean;

    public constructor(prop : string){
        super( prop, AggregateProjection.AggregateFunction.COUNT );
    }

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
        
        return filteredRecords;
    }
}