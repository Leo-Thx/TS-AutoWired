
import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

import * as _ from "lodash";

// 对结果集的列表进行排序
export class Order implements IRequestCondition, IDataProcessor{
    private propertyName : string;
    private ignore : boolean;
    private ascending : boolean;    // true:asc, false:desc

    constructor(propertyName:string, ascending:boolean){
        this.propertyName = propertyName;
        this.ascending = ascending;
    }

    getPropertyName() : string{
        return this.propertyName;
    }

    ignoreCase() : Order{
        this.ignore = true;
        return this;
    }

    static asc( propertyName : string ) : Order{
        return new Order( propertyName, true );
    }
    static desc( propertyName : string ) : Order{ 
        return new Order( propertyName, false );
    }


    /**
     * @override
     */
    buildRequestCondition(condition : RequestCondition) : void{
        condition.addOrder(this.propertyName, this.ascending ? "ASC" : "DESC");
    }

    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let records : any = _.sortBy( filteredRecords.records, obj=>{ return obj[ this.propertyName ] } );
        
        if( !this.ascending ){
            records = _.reverse( records );
        }

        filteredRecords.records = records;
        return filteredRecords;
    }
}