import { Observable } from "rxjs/Observable"

import { Criteria } from "./Criteria.interface";

import { Criterion } from "./Criterion.interface";
import { Order } from "./order/Order";
import { Projection } from "./projection/Projection.interface";
import { SimpleProjection } from "./projection/SimpleProjection.projection";

import { RequestCondition } from "./RequestCondition";
import { IRequestCondition } from "./IRequestCondition";

import { FilteredRecords } from "./FilteredRecords";
import { IDataProcessor } from "./IDataProcessor"

import { CriteriaHttp } from "../http/CriteriaHttp";

import { EntityDecoratorAnalyse, DecoratorManager } from "../decorator/index";

/**
 * @class CriteriaImpl
 * @implements Criteria
 * @description 构造requestCondition、数据过滤
 */
export class CriteriaImpl implements Criteria{

    /**
     * @property criterionEntries
     * @description 查询接口和查询条件对应的实例
     */
    private criterionEntries : Array<CriteriaImpl.CriterionEntry> = [];
    /**
     * @property orderEntries
     * @description 排序条件和查询接口对应的实例
     */
    private orderEntries : Array<CriteriaImpl.OrderEntry> = [];

    /**
     * @property projection
     * @description 当前查询接口实例关联的投影
     */
    private projection : Projection;
    /**
     * @description 投影关联的查询接口实例
     */
	private projectionCriteria : Criteria;

    private maxResults : number;
	private firstResult : number;

    private condition : RequestCondition;
    private records : FilteredRecords;

    public readonly filter : boolean;   // true表示前端过滤，false则会生成查询条件发送给后台

    private criteriaHttp : CriteriaHttp;
    private entity : string | Function;

    constructor(filter:boolean=false, entity : string | Function, criteriaHttp : CriteriaHttp){
        this.filter = filter;
        this.condition = new RequestCondition();
        this.entity = entity;
        this.criteriaHttp = criteriaHttp;
    }

    /**
     * @method add
     * @param expression @type Criterion 一个查询条件
     */
    add( expression : Criterion ) : Criteria;
    /**
     * @param expression 查询条件
     * @param criteria 查询接口实例
     */
    add( expression : Criterion, criteria : Criteria ) : Criteria;
    add( expression : Criterion, criteria? : Criteria ) : Criteria{
        if( !criteria ){
            this.add( expression, this );
        }else{
            this.criterionEntries.push( new CriteriaImpl.CriterionEntry( expression, criteria ) );
            this.handleRequestCondition( expression );
        }
        return this;
    }

    /**
     * @method addOrder
     * @description 添加排序条件
     */
    addOrder( order : Order ) : Criteria{
        this.orderEntries.push( new CriteriaImpl.OrderEntry( order, this ) );
        this.handleRequestCondition( order );
        return this;
    }

    // 需要根据配置传入的参数和当前对象，进行本地查询或者是调用接口
    // 本地存储 ? 内存储存
    list() : Observable<any>{
        return new Observable(observer=>{
            this.criteriaHttp.getRemoteWithGet(this.condition).subscribe(response=>{
                let responseData = {    // 为测试 构造假的数据
                    list : response
                }
                this.records = new FilteredRecords( this.condition, responseData );
                this.handleRemoteData( this.records );
                this.autoWiredEntity( this.records );

                // 返回数据到上层
                observer.next( this.records ); 
            });
        });
    }

    /**
     * @description 设置查询的起始位置
     */
    setFirstResult( firstResult : number) : Criteria{
        this.firstResult = firstResult;
        this.condition.setFirstResult(firstResult);
        return this;
    }
    getFirstResult() : number{ 
        return this.firstResult; 
    }
    /**
     * @description 设置查询的最大行数
     */
    setMaxResults( maxResults : number ) : Criteria{
        this.maxResults = maxResults;
        this.condition.setMaxResults( maxResults );
        return this;
    }
    getMaxResults() : number { 
        return this.maxResults; 
    }

    /**
     * @description 给当前查询接口添加映射
     */
    setProjection( project : Projection ) : Criteria{
        this.projection = project;
        this.projectionCriteria = this;
        this.handleRequestCondition( project );
        return this;
    }
    getProjection() : Projection { 
        return this.projection; 
    }


    /**
     * @method handleRequestCondition
     * @param expression 
     * @description 处理请求条件
     */
    handleRequestCondition( expression : Criterion ){
        let instance = <IRequestCondition>expression;
        if( typeof instance.buildRequestCondition === 'function' ){
            instance.buildRequestCondition( this.condition );
        }

    }


    /**
     * @description 处理远程数据过滤 未处理分组
     */
    handleRemoteData(records : FilteredRecords){
        // Criterion
        for(let criterionEntry of this.criterionEntries){
            let criterion = <IDataProcessor>criterionEntry.getCriterion();
            criterion.dataProcessor( records );
        }

        // projecttion|projectionList
        let projection = <SimpleProjection>this.getProjection();
        if( projection ){
            projection.dataProcessor( records );
        }

        // Order
        for( let orderEntry of this.orderEntries ){
            let order = <IDataProcessor>orderEntry.getOrder();
            order.dataProcessor( records ); 
        }
    }


    /**
     * @description 将数据转换为实体对象
     */
    autoWiredEntity(filteredRecords : FilteredRecords){
        let records = filteredRecords.records;
        let entityAnalyseInstance = <EntityDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( EntityDecoratorAnalyse.DECORATOR_NAME );
        records = entityAnalyseInstance.processRecord( records, this.entity );
        filteredRecords.records = records;
    }
}

export namespace CriteriaImpl{
    /**
     * @class CriterionEntry
     * @description 查询接口和查询条件的映射
     */
    export class CriterionEntry{
        private criterion: Criterion;
        private criteria : Criteria;

        constructor(criterion : Criterion, criteria : Criteria){
            this.criterion = criterion;
            this.criteria = criteria;
        }

        public getCriterion() : Criterion{ return this.criterion; }
        public getCriteria() : Criteria{ return this.criteria; }
    }

    /**
     * @class OrderEntry
     * @description 排序条件和查询接口的关联关系
     */
    export class OrderEntry{
        private order : Order;
        private criteria : Criteria;

        constructor(order:Order, criteria : Criteria){
            this.order = order;
            this.criteria = criteria;
        }

        public getOrder() : Order{ return this.order; }
        public getCriteria() : Criteria{ return this.criteria; }
    }
}