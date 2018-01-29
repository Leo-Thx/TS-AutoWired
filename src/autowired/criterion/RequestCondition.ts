/*
    Aggregation:    聚合函数
        max : [propertyName]
        min : [propertyName]
        count : [propertyName]
        sum : [propertyName]
        avg : [propertyName]
    RowCount : 行统计
        rowCount : boolean
    Group : 分组
        group : [propertyName]
    Order : 排序
        order : [{ propertyName : string, type : string }, ...]
    Pagination : 分页
        firstResult : number
        maxResults : number
    Property : 字段属性比较
        propertyName : [{type : eq/ne/gt/ge/lt/le/between/in/like.., value: any, matchMode:EXACT/ANYWHERE/START/END}]
        propertyName : { eq/ne/gt/ge/lt/le/between/in/like.. : { value: any, matchMode:EXACT/ANYWHERE/START/END } }   
        [{
            propertyName : string,
            operator : [{
                name : eq/ne/gt/ge/lt/le/between/in/like... 
                value : any | any[] | { min:any, max:any },
                matchMode : matchMode:EXACT/ANYWHERE/START/END,
                ignoreCase : boolean, 
                isOtherPro : boolean
            }]
        }]
    Example : {
        entity : {} // 匹配的键值对
        excludedProperties : [] // 排除的字段
        ignoreCase : boolean // 是否忽略大小写
        isLike : boolean // 是否使用like
        matchMode : string // 匹配的模式
    }    
    And|or : [{ // unused
        propertyName : string,
            operator : [{
                name : eq/ne/gt/ge/lt/le/between/in/like... 
                value : any | any[] | { min:any, max:any },
                matchMode : matchMode:EXACT/ANYWHERE/START/END,
                ignoreCase : boolean, 
                isOtherPro : boolean
            }]
    }]
    // and or 操作
 */

import * as _ from "lodash";
import { MatchMode } from "./MatchMode";

export type aggregationType = { [functionName:string] : string[] };
export type groupType = string[];
export type orderType = { propertyName:string, type:string }[];
export type paginationType = { firstResult : number, maxResults : number };

export type exampleType = {
    entity : { [key:string] : any },
    excludedProperties : string[],
    ignoreCase : boolean,
    isLike : boolean,
    matchMode : string
}

export type operatorType = {
    name : string,
    value : any | any[] | { min:any, max:any },
    matchMode? : string,
    ignoreCase? : boolean,   // 默认不忽略大小写 false
    isOtherPro? : boolean   // 比较当前对象的不同属性值 只存在于name为OTHERPROPERTY
};

export type propertyType = {
    propertyName : string,
    operator : operatorType[]
};

export type propertyTypes = propertyType[];


/**
 * @class RequestCondition
 * @description 查询条件
 */
export class RequestCondition{
    public aggregation : aggregationType;
    public rowCount : boolean;
    public group : groupType;
    public order : orderType;
    public pagination : paginationType
    public property : propertyTypes;
    public example : exampleType;

    constructor(isPagination:boolean = false){
        this.aggregation = {};
        this.rowCount = false;
        this.group = [];
        this.order = [];

        if( isPagination ){
            this.initPagination(0, 0);
        }

        this.property = [];
    }

    private initPagination(firstResult:number=0, maxResults:number=0){
        if( !this.pagination ){
            this.pagination = {
                firstResult,    // 从哪行记录开始
                maxResults // 取多少行
            }
        }
    }
    public setFirstResult(firstResult : number) : void{
        this.initPagination();
        this.pagination.firstResult = firstResult;
    }
    public setMaxResults(maxResults : number) : void{
        this.initPagination();
        this.pagination.maxResults = maxResults;
    }
    

    public addAggregation( type:string, propertyName:string ):RequestCondition{
        if( !this.aggregation[ type ] ){
            this.aggregation[ type ] = [];
        }
        this.aggregation[ type ].push( propertyName );
        return this;
    }

    public setRowCount() : RequestCondition{
        this.rowCount = true;
        return this;
    }

    public addGroup(propertyName:string, index?:number) : RequestCondition{
        if( index != undefined ){
            this.group.splice( index, 0, propertyName );
        }else{
            this.group.push( propertyName );
        }
        return this;
    }

    public addOrder(propertyName:string, type:string) : RequestCondition {
        var orderProperty = _.find( this.order, {propertyName} );
        if( !orderProperty ){
            this.order.push( {propertyName, type} );
        }else{
            orderProperty.type = type;
        }
        return this;
    }


    private getOperator(propertyName:string, type:string, otherProperty?:string, isOtherPro?:boolean) : operatorType{
        let propertyItem = _.find( this.property, {propertyName} );
        if( !propertyItem ){    // 没有添加过
            propertyItem = {    // 重新构造新的
                propertyName,
                operator : [
                    // { name, value, matchMode? }
                ] as operatorType[]
            } as propertyType;
            this.property.push( propertyItem );
        }
        
        let operators = propertyItem.operator;  // 所有属性操作符
        let operator = _.isBoolean(isOtherPro) ? // 表示为同属性比较
            _.find( operators, {name:type, value:otherProperty, isOtherPro} ) : 
            _.find( operators, {name:type} );    //查找是否存在某个类型
        
        if( !operator ){
            operator = {} as operatorType;
            operators.push( operator );
        }
        return operator;
    }


    public addLikeProperty(propertyName:string, value:any, ignoreCase?:boolean, matchMode?:MatchMode) : RequestCondition{
        let operator = this.getOperator(propertyName, "LIKE");
        
        operator.matchMode = MatchMode[ matchMode ]; // EXACT,ANYWHERE...
        operator.ignoreCase = ignoreCase;   // 忽略大小写

        operator.name = "LIKE";
        operator.value = value;
        
        return this;
    }

    public addOtherProperty(propertyName:string, type:string, otherProperty:string) : RequestCondition{
        let operator = this.getOperator(propertyName, type, otherProperty, true);

        operator.name = type;   // 比较符号
        operator.value = otherProperty; // 比较的属性
        operator.isOtherPro = true; // 标志
        
        return this;
    }

    public addExampleProperty( example : exampleType ):RequestCondition{
        this.example = example;
        return this;
    }

    public addProperty(propertyName:string, type:"BETWEEN", value:{ min:any, max:any }) : RequestCondition;
    public addProperty(propertyName:string, type:"IN", value:any[]) : RequestCondition;

    public addProperty(propertyName:string, type:string, value:any) : RequestCondition;

    public addProperty(propertyName:string, type:"BETWEEN" | "IN" | string, value:any) : RequestCondition{
        let operator = this.getOperator(propertyName, type);

        operator.name = type;
        operator.value = value;

        return this;
    }
}