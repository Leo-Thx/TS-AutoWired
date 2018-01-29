import { Criterion } from "../Criterion.interface";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

export class Junction  implements Criterion, IRequestCondition, IDataProcessor{
    protected nature : Junction.Nature;
    protected conditionList : Array<Criterion> = [];
    constructor( nature : Junction.Nature ){
        this.nature = nature;
    }
    getNature() : Junction.Nature{ return this.nature; }

    add( criterion : Criterion ) : Junction{ 
        this.conditionList.push( criterion ); 
        return this;
    }
    // 暂时用数组替代
    conditions() : Array<Criterion> { return this.conditionList;}

     /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        let conditionInstance : IRequestCondition = null;
        let i, length = this.conditionList.length;
        for(i=0; i<length; i++){
            conditionInstance = <IRequestCondition>this.conditionList[ i ];
            if( typeof conditionInstance.buildRequestCondition === 'function' ){
                conditionInstance.buildRequestCondition( condition );
            }
        }
    }

    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let conditionInstance : IDataProcessor = null;
        let i, length = this.conditionList.length;
        for(i=0; i<length; i++){
            conditionInstance = <IDataProcessor>this.conditionList[ i ];
            if( typeof conditionInstance.dataProcessor === 'function' ){
                conditionInstance.dataProcessor( filteredRecords );
            }
        }
        return filteredRecords;
    }
}


export namespace Junction{
    export enum Nature{
        AND,
        OR
    }
}