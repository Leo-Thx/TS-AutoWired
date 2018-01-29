import { SimpleProjection } from "./SimpleProjection.projection";
import { RequestCondition } from "../RequestCondition";
import { FilteredRecords } from "../FilteredRecords";

/**
 * @class RowCountProjection
 * @extends SimpleProjection
 * @description 行统计[待定]
 * @deprecated 暂不使用
 */
export class RowCountProjection extends SimpleProjection{
    
    constructor(){ 
        super(); 
    }
    /**
     * @override
     * @description 需要后台数据提供值 count(*) 由数据库所得
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let countNumber = filteredRecords.originRecords.totals || filteredRecords.records.length;
        filteredRecords.setRowCount( countNumber );
        return filteredRecords;
    }

    /**
     * @override
     */
    buildRequestCondition( condition : RequestCondition ) : RequestCondition{
        condition.setRowCount();
        return condition;
    }
}