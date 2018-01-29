import { Criterion } from "../Criterion.interface";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

/**
 * @abstract @class AbstractEmptinessExpression
 * @description 处理为空表达式和不为空表达式基类
 */
export abstract class AbstractEmptinessExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected propertyName : string;

    constructor(proName:string){
        this.propertyName = proName;
    }

    protected abstract excludeEmpty() : boolean;

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addProperty(this.propertyName, "EMPTY", this.excludeEmpty());
    }

    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator("EMPTY", (propertyName, operatorEntry)=>{
            let isNotEmpty : boolean = operatorEntry.value;   // true表示不为空
            for(let record of filteredRecords.records){
                if( isNotEmpty ){   // 不允许为空
                    if( record[ propertyName ] != undefined ) records.push( record );
                }else{  // 表示为空
                    if( record[ propertyName ] == undefined ) records.push( record );
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }
}