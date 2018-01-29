import { Observable } from "rxjs/Observable";
import { Criterion } from "./Criterion.interface";
import { Order } from "./order/Order";
import { Projection } from "./projection/Projection.interface";

/**
 * 查询接口
 * 链式查询节点 | 条件数组
 */
export interface Criteria{
    /**
     * @description 添加一个查询条件
     * @param criterion Criteria 查询条件
     * @returns Criteria 返回查询接口
     */
    add( criterion : Criterion ) : Criteria;
    /**
     * @description 对结果集进行排序
     * @param order : Order
     * @returns Criteria
     */
    addOrder( order : Order ) : Criteria;
    /**
     * @description 
     * @returns
     */
    list() : Observable<any>;
    /**
     * @description
     * @param @type firstResult number
     * @returns
     */
    setFirstResult( firstResult : number) : Criteria;
    /**
     * @description
     * @param @type maxResults number
     * @returns
     */
    setMaxResults( maxResults : number ) : Criteria;
    /**
     * @description 添加投影、聚合、分组
     * @param project @type Projection
     * @returns
     */
    setProjection( project : Projection ) : Criteria;
}