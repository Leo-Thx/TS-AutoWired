import { Criterion } from "../Criterion.interface";

import { RequestCondition } from "../RequestCondition";
import { MatchMode } from "../MatchMode";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

export class SimpleExpression implements Criterion, IRequestCondition, IDataProcessor{
    protected propertyName : string;
    protected value : any;  // 可能是正则实例
    protected opType : SimpleExpression.OperatorType;
    protected op : string;  // operator:=
    protected ignore : boolean; // 默认不忽略大小写

    constructor(propertyName:string, value:any, op:SimpleExpression.OperatorType);
    constructor(propertyName:string, value:any, op:SimpleExpression.OperatorType, ignoreCase:boolean);
    constructor(propertyName:string, value:any, op:SimpleExpression.OperatorType, ignoreCase?:boolean){
        this.propertyName = propertyName;
        this.value = value;
        this.opType = op;
        this.op = SimpleExpression.OperatorType[ op ];
        this.ignore = ignoreCase;
    }

    getOp():string{ return this.op; }

    getPropertyName():string{ return this.propertyName};

    getValue():any{ return this.value; }

    ignoreCase() : SimpleExpression{ 
        this.ignore = true; 
        return this;
    }

    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        if( this.opType == SimpleExpression.OperatorType.LIKE ){    // like匹配，同时不忽略大小写
            condition.addLikeProperty(
                this.getPropertyName(),
                this.value,
                this.ignore
            );
        }else {
            condition.addProperty(
                this.getPropertyName(),
                this.op,
                this.value
            );
        }
    }


    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any[] = [];
        filteredRecords.getPropertyOperator(this.getOp(), (propertyName, operatorEntry)=>{
            for(let record of filteredRecords.records){
                if( operatorEntry.name === 'LIKE' ){
                    let value : string | RegExp = operatorEntry.value;
                    if( value instanceof RegExp && value.test( record[ propertyName ] ) ){
                        records.push( record );
                    }else{
                        if( record[ propertyName ] === value ){
                            records.push( record );
                        }
                    }
                }else{
                    if( this.handleOperator( record[ propertyName ], operatorEntry.value ) ){
                        records.push( record );
                    }
                }
            }
        });
        filteredRecords.records = records;
        return filteredRecords;
    }

    /**
     * @description 根据当前实例类型进行属性值的比较
     */
    handleOperator(left:any, right:any) : boolean{
        switch( this.opType ){
            case SimpleExpression.OperatorType.EQ : return left === right;
            case SimpleExpression.OperatorType.NE : return left !== right;
            case SimpleExpression.OperatorType.GT : return left > right;
            case SimpleExpression.OperatorType.GE : return left >= right;
            case SimpleExpression.OperatorType.LT : return left < right;
            case SimpleExpression.OperatorType.LE : return left <= right;
        }
    }

    static handleOperator(left:any, right:any, opType:SimpleExpression.OperatorType) : boolean{
        switch( opType ){
            case SimpleExpression.OperatorType.EQ : return left === right;
            case SimpleExpression.OperatorType.NE : return left !== right;
            case SimpleExpression.OperatorType.GT : return left > right;
            case SimpleExpression.OperatorType.GE : return left >= right;
            case SimpleExpression.OperatorType.LT : return left < right;
            case SimpleExpression.OperatorType.LE : return left <= right;
        }
    }
}

export namespace SimpleExpression{
    export enum OperatorType{
        EQ,
        NE,
        GT,
        GE,
        LT,
        LE,
        LIKE
    }
}