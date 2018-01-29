/*
    data : {
        originRecords : data,
        records : data,
        totals : 100,
        pageSize : 10,
        pageNum : 1
    
        Aggregation: {  聚合函数
            max : [{propertyName : name, value : string}]
            min : ..
            count ..
            sum : ..
            avg : ..
        }
        RowCount : {    行统计
            rowCount : boolean,
            value : number
        }
        Group : 分组
            group : [propertyName]
        Order : 排序
            order : [{ propertyName : string, type:string }, ...]
        Pagination : 分页
            firstResult : number
            maxResults : number
        Property : 字段属性比较
            [{
                propertyName : string,
                type : [{
                    name : eq/ne/gt/ge/lt/le/between/in/like...
                    value : any | any[] | { min:any, max:any },
                    matchMode : matchMode:EXACT/ANYWHERE/START/END
                }]
            }]  
        Example : {
            entity : {} // 匹配的键值对
            excludedProperties : [] // 排除的字段
            ignoreCase : boolean // 是否忽略大小写
            isLike : boolean // 是否使用like
            matchMode : string // 匹配的模式
        }    
        // and or 操作
     }
 */

import * as _ from "lodash";
import { orderType, operatorType, propertyType, propertyTypes, paginationType, RequestCondition, exampleType } from "./RequestCondition";

/**
 * @class FilteredRecords
 * @description 经过Expression和Projection之后的结果集
 */
export class FilteredRecords{
    /**
     * 原始请求对象
     */
    public requestCondition : RequestCondition;
    /**
     * 原始数据列表[由后台返回]
     */
    public originRecords : any;

    /**
     * 经过统计和过滤后的列表[数组]
     */
    public records : any;
    /**
     * 是否允许分页
     */
    public isPagination : boolean;
    public totals : number;
    public pageSize : number;
    public pageNumber : number;

    /**
     * 分页查询参数, 由请求获得
     */
    public pagination : paginationType;

    /**
     * 对使用聚合函数的字段属性的统计
     */
    public aggregation : {
        [functionName:string] : {propertyName : string, value : any}[]
    };

    /**
     * 行统计数据列
     */
    public rowCount : { isRowCount : boolean, value : number };

    public group : { propertyName : string[] }; // 分组条件不参与数据统计与计算

    public order : orderType;   // 排序条件不参与数据统计与计算

    public property : propertyTypes;    // 筛选条件不参与数据统计与计算

    public example : exampleType;

    constructor(requestCondition : RequestCondition, originRecords:any){
        this.requestCondition = requestCondition;
        
        this.pagination = requestCondition.pagination;
        this.isPagination = !_.isUndefined( this.pagination );
        
        this.rowCount = { isRowCount:requestCondition.rowCount, value:0 };
        this.group = { propertyName : requestCondition.group }; // 分组
        this.order = requestCondition.order;    // 排序
        this.property = requestCondition.property;  // 其他属性
        this.example = requestCondition.example;
        
        this.originRecords = originRecords;
        
        this.aggregation = {};

        this.init();
    }


    
    public getPropertyOperator( type:string, callback:(propertyName:string, operatorEntry:operatorType)=>void ) : propertyTypes{
        var propertyCondition : propertyTypes = [];

        // 属性名 : [operator]
        var propertyName : string;
        var operatorType : propertyType;

        for(let properyEntry of this.property){
            let operators = properyEntry.operator; // 所有操作

            for( let operatorEntry of operators ){ // 遍历操作数组

                if( operatorEntry.name === type ){   // 操作符一致
                    propertyName = properyEntry.propertyName;    // 属性名

                    operatorType = _.find( propertyCondition, {propertyName} );

                    if( !operatorType ){
                        operatorType = <propertyType>{};
                        operatorType.propertyName = propertyName;
                        operatorType.operator = [];
                        propertyCondition.push( operatorType );
                    }

                    callback(propertyName, operatorEntry);

                    operatorType.operator.push( operatorEntry );
                }
            }
        }

        return propertyCondition;
    }

    /**
     * 设置分页
     */
    public setPagination(pageNumber:number, pageSize:number) : FilteredRecords{
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.isPagination = true;
        this.handlePagination();
        return this;
    }

    public setRowCount(rowCount:number) : FilteredRecords{
        this.rowCount.isRowCount = true;
        this.rowCount.value = rowCount;
        return this;
    }

    private init(){ // 初始化数据
        var list = this.originRecords.list;  //原始数据列表
        var isArray = _.isArray( list );

        if( !list ) list = [];  // 没有数据
        if( !isArray ) list = [ list ]; // 不是数组类型

        this.records = list;

        this.handlePagination();
    }

    private handlePagination(){
        if( this.isPagination ){  // 表示已经开启分页
            this.totals = this.originRecords.totals;
        }
    }

    public setRecords(records:any) : FilteredRecords{
        this.records = records;
        return this;
    }

    /**
     * @method setAggregation
     * @param functionName 聚合函数名称
     * @param propertyName 要聚合的字段
     * @param value 聚合后的值
     */
    public setAggregation(functionName:string, propertyName:string, value:any) : FilteredRecords{
        var functionAggregation = this.aggregation[ functionName ];

        if( !functionAggregation ){
            functionAggregation = [];
            this.aggregation[ functionName ] = functionAggregation;
        }

        var propertyItem = _.find( functionAggregation, {propertyName} );
        if( !propertyItem ){
            propertyItem = {
                propertyName, value
            };
            functionAggregation.push( propertyItem );
        }

        propertyItem.propertyName = propertyName;
        propertyItem.value = value;

        return this;
    }
}