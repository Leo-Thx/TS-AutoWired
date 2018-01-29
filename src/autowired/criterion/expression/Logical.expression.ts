import { Criterion } from "../Criterion.interface";
import { Junction } from "../junction/Junction.criterion";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

import * as _ from "lodash";

export class LogicalExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected leftValue : Criterion;
    protected rightValue : Criterion;
    protected op : string;
    protected junctionType : Junction.Nature;

    constructor( lhs : Criterion, rhs : Criterion, op : Junction.Nature ){
        this.leftValue = lhs;
        this.rightValue = rhs;
        this.junctionType = op;
        this.op = Junction.Nature[ op ];
    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        let leftValue = <IRequestCondition>this.leftValue;
        var rightValue = <IRequestCondition>this.rightValue;
        
        if( _.isFunction(leftValue.buildRequestCondition) ){
            leftValue.buildRequestCondition(condition);
        }
        if( _.isFunction(rightValue.buildRequestCondition) ){
            rightValue.buildRequestCondition(condition);
        }
    }


    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        
        let leftValue = <IDataProcessor>this.leftValue;
        var rightValue = <IDataProcessor>this.rightValue;
        
        if( _.isFunction(leftValue.dataProcessor) ){
            leftValue.dataProcessor(filteredRecords);
        }
        if( _.isFunction(rightValue.dataProcessor) ){
            rightValue.dataProcessor(filteredRecords);
        }

        return filteredRecords;
    }
}