import { Criterion } from "../Criterion.interface";
import { SimpleExpression } from "./Simple.expression";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

/**
 * 对象同属性比较
 */
export class PropertyExpression implements Criterion, IRequestCondition, IDataProcessor{
    public propertyName : string;
    public otherPropertyName : string;
    public op : string;
    protected opType : SimpleExpression.OperatorType;

    getOp() : string{ return this.op; }

    public constructor(proName:string, otherProName:string, op:SimpleExpression.OperatorType){
        this.propertyName = proName;
        this.otherPropertyName = otherProName;
        this.opType = op;
        this.op = SimpleExpression.OperatorType[ op ];
    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addOtherProperty(this.propertyName, this.op, this.otherPropertyName);
    }


    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator(this.op, (propertyName, operatorEntry)=>{
            for(let record of filteredRecords.records){
                let recordValue = record[ propertyName ];
                let compareValue = record[ operatorEntry.value ];
                if( SimpleExpression.handleOperator( recordValue, compareValue, this.opType ) ){
                    records.push( record );
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }
}
