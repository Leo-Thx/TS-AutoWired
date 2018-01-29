import { SimpleProjection } from "./SimpleProjection.projection";
import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

/**
 * @class PropertyProjection
 * @extends SimpleProjection
 * @description 某个字段的操作
 */
export class PropertyProjection extends SimpleProjection{
    protected propertyName : string;
    protected grouped : boolean;

    public constructor(propertyName : string) ;
    public constructor(propertyName : string, grouped : boolean);
    public constructor(propertyName : string, grouped? : boolean){
        super();
        this.propertyName = propertyName;
        this.grouped = grouped;
    }

    getPropertyName() : string{ return this.propertyName; }
    isGrouped() : boolean{ return this.grouped; }


    /**
     * @override
     */
    buildRequestCondition( condition : RequestCondition ) : RequestCondition{
        if( this.isGrouped() ){
            condition.addGroup( this.getPropertyName() );
        }
        return condition;
    }
    
    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        
        return filteredRecords;
    }
}