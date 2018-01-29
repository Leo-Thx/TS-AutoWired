import { Criterion } from "../Criterion.interface";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

export class InExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected propertyName : string;
    protected values : Array<any>;

    public constructor( propertyName:string, values:any[]){
        this.propertyName = propertyName;
        this.values = values;
    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addProperty(this.propertyName, "IN", this.values);
    }

    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator("IN", (propertyName, operatorEntry)=>{
            for(let record of filteredRecords.records){
                let recordValue = record[ propertyName ];
                let compareValue = operatorEntry.value;
                if( compareValue.some( (item:any)=>{return item == recordValue;} )){
                    records.push( record );
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }
}