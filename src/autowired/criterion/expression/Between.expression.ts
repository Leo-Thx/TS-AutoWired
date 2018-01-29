import { Criterion } from "../Criterion.interface";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

export class BetweenExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected propertyName : string;
    protected leftValue : any;
    protected rightValue : any;

    constructor(proName:string, lv:any, rv:any){
        this.propertyName = proName;
        this.leftValue = lv;
        this.rightValue = rv;
    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addProperty(this.propertyName, "BETWEEN", {
            min : this.leftValue,
            max : this.rightValue
        });
    }

    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator("BETWEEN", (propertyName, operatorEntry)=>{
            for(let record of filteredRecords.records){
                let recordValue = record[ propertyName ];
                let compareValue = operatorEntry.value;
                if( recordValue >= compareValue.min && recordValue <= compareValue.max ){
                    records.push( record );
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }
}