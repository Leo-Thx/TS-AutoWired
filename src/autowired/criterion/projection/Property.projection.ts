import { PropertyProjection } from "./PropertyProjection.projection";

import { AggregateProjection } from "./Aggregate.projection";
import { AvgProjection } from "./Avg.projection";
import { CountProjection } from "./Count.projection";

import { Order } from "../order/Order";
import { Criterion } from "../Criterion.interface";

import { SimpleExpression } from "../expression/Simple.expression";
import { PropertyExpression } from "../expression/Property.expression";

import { MatchMode } from "../MatchMode";

import { Restrictions } from "../Restrictions";
import { Projections } from "./Projections";

// A factory for property-specific criterion and projection instances
// equal/ not equal/ greater than/ less than/ less than or equal/ great than or equal/...
/**
 * @class Property
 * @extends PropertyProjection
 * @description 生成对一个明确的属性查询条件的工厂，根据当前的实例可以对集合进一步的过滤
 * 统计、查询、排序、分组
 */
export class Property extends PropertyProjection{

    protected constructor(propertyName : string){ 
        super( propertyName ); 
    }
    
    /**
     * @static @method forName
     * @param propertyName @type string
     * @returns @type Property 
     * @description 根据传入的属性生成新的Property
     */
    static forName( propertyName : string) : Property{
        return new Property( propertyName ); 
    }

    /**
     * @method asc 升序
     * @method desc 降序
     * @returns @type Order
     * @description 根据某个属性字段进行排序的操作
     */
    asc() : Order { 
        return Order.asc( this.getPropertyName() );
    }
    desc() : Order{
        return Order.desc( this.getPropertyName() );
    }

    /**
     * @method avg
     * @returns AggregateProjection
     * @description 根据当前实例的属性字段对结果集进行统计
     */
    avg() : AggregateProjection { 
        return Projections.avg( this.getPropertyName() );
    }

    /**
     * @method between
     * @returns @type Criterion 查询条件
     * @description 对当前属性值区间匹配
     */
    between( min:any, max:any ) : Criterion {
        return Restrictions.between( this.getPropertyName(), min, max );
    }

    /**
     * @method count
     * @description 当前属性统计行数
     */
    count() : CountProjection{
        return Projections.count( this.getPropertyName() );
    } 

    
    eqOrIsNull( value : any) : Criterion{
        return Restrictions.eqOrIsNull( this.getPropertyName(), value );
    }
    
    neOrIsNotNull( value:any ) : Criterion{
        return Restrictions.neOrIsNotNull( this.getPropertyName(), value );
    }
    
    eq(value : any) : SimpleExpression {
        return Restrictions.eq( this.getPropertyName(), value );
    }
    eqProperty(other:string) : PropertyExpression;
    eqProperty(other:Property) : PropertyExpression;
    /**
     * @method eqProperty
     * @param other 属性名或Property实例
     * @description 两个属性值相等
     */
    eqProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.eqProperty( this.getPropertyName(), other );
        }
        return Restrictions.eqProperty( this.getPropertyName(), other.getPropertyName() );
    }

    ne(value:any) : SimpleExpression{
        return Restrictions.ne( this.getPropertyName(), value );
    }
    neProperty(other:string) : PropertyExpression;
    neProperty(other:Property) : PropertyExpression;
    neProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.neProperty( this.getPropertyName(), other );
        }
        return Restrictions.neProperty( this.getPropertyName(), other.getPropertyName() );
    }

    // getProperty( propertyName : string ) : Property {
    //     return Property.forName( this.getPropertyName() + "." + propertyName );
    // }

    /**
     * @method group
     * @description 当前属性进行分组
     */
    group() : PropertyProjection{
        return Projections.groupProperty( this.getPropertyName() );
    }


    gt(other:any) : SimpleExpression{
        return Restrictions.gt( this.getPropertyName(), other );
    }

    gtProperty(other:string) : PropertyExpression;
    gtProperty(other:Property) : PropertyExpression;
    gtProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.gtProperty( this.getPropertyName(), other );
        }
        return Restrictions.gtProperty( this.getPropertyName(), other.getPropertyName() );
    }

    ge(other:any) : SimpleExpression{ 
        return Restrictions.ge( this.getPropertyName(), other ); 
    }

    geProperty(other:string) : PropertyExpression;
    geProperty(other:Property) : PropertyExpression;
    geProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.geProperty( this.getPropertyName(), other );
        }
        return Restrictions.geProperty( this.getPropertyName(), other.getPropertyName() );
    }

    lt(other:any) : SimpleExpression{
        return Restrictions.lt( this.getPropertyName(), other );
    }

    ltProperty(other:string) : PropertyExpression;
    ltProperty(other:Property) : PropertyExpression;
    ltProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.ltProperty( this.getPropertyName(), other );
        }
        return Restrictions.ltProperty( this.getPropertyName(), other.getPropertyName() );
    }

    le(other:any) : SimpleExpression{
        return Restrictions.le( this.getPropertyName(), other );
    }

    leProperty(other:string) : PropertyExpression;
    leProperty(other:Property) : PropertyExpression;
    leProperty(other:string | Property) : PropertyExpression{
        if( typeof other === 'string' ){
            return Restrictions.leProperty( this.getPropertyName(), other );
        }
        return Restrictions.leProperty( this.getPropertyName(), other.getPropertyName() );
    }


    in( values : any[] ):Criterion{
        return Restrictions.in( this.getPropertyName(), values );
    }

    // notIn(values:any[]) : Criterion{ return null;}

    isEmpty() : Criterion{
        return Restrictions.isEmpty( this.getPropertyName() );
    }
    isNotEmpty() : Criterion{
        return Restrictions.isNotEmpty( this.getPropertyName() );
    }
    isNull() : Criterion{
        return Restrictions.isNull( this.getPropertyName() );
    }
    isNotNull() : Criterion{
        return Restrictions.isNotNull( this.getPropertyName() );
    }

    like(value:any) : SimpleExpression;
    like(value:string, matchMode : MatchMode) : SimpleExpression;
    like(value:string | any, matchMode? : MatchMode) : SimpleExpression {
        return Restrictions.like( this.getPropertyName(), value, matchMode );
    }

    max() : AggregateProjection{ 
        return Projections.max( this.getPropertyName() );
    }
    min() : AggregateProjection{ 
        return Projections.min( this.getPropertyName() );
    }
}