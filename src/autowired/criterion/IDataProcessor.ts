import { FilteredRecords } from "./FilteredRecords";

export interface IDataProcessor{
    
    /**
     * @method @abstract dataProcessor
     * @param condition @type RequestCondition 数据集
     * @returns @type FilteredRecords 操作之后的数据
     * @description 当前实例对数据集合进行的筛选操作，供上层接口调用，由子类实现
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords;
}