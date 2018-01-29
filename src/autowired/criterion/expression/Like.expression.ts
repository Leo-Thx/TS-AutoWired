import { Criterion } from "../Criterion.interface";
import { MatchMode } from "../MatchMode";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { SimpleExpression } from "./Simple.expression";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";


// 处理精确匹配，同时忽略大小写
export class LikeExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected propertyName : string;
    protected value : string|RegExp;
    protected matchMode : MatchMode;
    protected ignoreCase : boolean;

    private static isMatchMode( matchMode : boolean | MatchMode ) : matchMode is MatchMode {
        return typeof matchMode !== 'boolean';
    }

    constructor(propertyName:string, value:string);
    constructor(propertyName:string, value:string, ignoreCase:boolean);

    constructor(propertyName:string, value:string, matchMode:MatchMode);
    constructor(propertyName:string, value:string, ignoreCase:boolean, matchMode:MatchMode);

    constructor(propertyName:string, value:string, ignoreCase?:boolean|MatchMode, matchMode?:MatchMode){
        this.propertyName = propertyName;
        this.value = value;

        if( LikeExpression.isMatchMode( ignoreCase ) ){
            this.matchMode = ignoreCase;
            this.ignoreCase = false;
            this.value = MatchMode.toMatchModeString(value, this.matchMode);
        } else {
            this.ignoreCase = ignoreCase as boolean;
            this.matchMode = matchMode;
        }

    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addLikeProperty(this.propertyName, this.value, this.ignoreCase, this.matchMode);
    }


    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator("LIKE", (propertyName, operatorEntry)=>{
            for(let record of filteredRecords.records){
                let recordValue = record[ propertyName ];
                let compareValue = operatorEntry.value;
                let regexp = MatchMode.toMatchModeIngnoreString(<string>compareValue, this.matchMode);
                if( regexp.test( recordValue ) ){
                    records.push( record );
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }
}


