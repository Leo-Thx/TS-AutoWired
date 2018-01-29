import { AggregateProjection } from "./Aggregate.projection";
import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

/**
 * @class AvgProjection
 * @extends AggregateProjection
 * @description 对某个属性进行平均值计算
 */
export class AvgProjection extends AggregateProjection{
    public constructor(prop : string){
        super( prop, AggregateProjection.AggregateFunction.AVG );
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