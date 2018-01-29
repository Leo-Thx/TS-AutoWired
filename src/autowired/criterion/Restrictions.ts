import { Criterion } from "./Criterion.interface"

import { SimpleExpression } from "./expression/Simple.expression";
import { LogicalExpression } from "./expression/Logical.expression";
import { LikeExpression } from "./expression/Like.expression";
import { BetweenExpression } from "./expression/Between.expression";
import { InExpression } from "./expression/In.expression";
import { EmptyExpression } from "./expression/Empty.expression";
import { NotEmptyExpression } from "./expression/NotEmpty.expression";
import { PropertyExpression } from "./expression/Property.expression";
import { NotExpression } from "./expression/Not.expression";

import { Junction } from "./junction/Junction.criterion";
import { ConJunction } from "./junction/ConJunction";
import { DisJunction } from "./junction/DisJunction";

import { MatchMode } from "./MatchMode";


/**
 * @class Restrictions
 * @description 查询条件生成工厂
 */
export class Restrictions{
    
    private constructor(){ throw ("cannot be instantiated"); }

    /**
     * @static @method eq
     * @returns @type SimpleExpression
     * @description 字段属性值相等
     */
    static eq( propertyName:string, value:any ) : SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.EQ );
    }

    /**
     * @static @method eqOrIsNull
     * @returns @type Criterion
     * @description 字段属性相等或为空
     */
    static eqOrIsNull( propertyName : string, value : any ) : Criterion{
        if( !value ){
            return Restrictions.isNull( propertyName );
        }
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.EQ );
    }
    /**
     * @static @method ne
     * @returns @type SimpleExpression
     * @description 不等
     */
    static ne( propertyName:string, value:any):SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.NE);    //<>
    }
    /**
     * @static @method neOrIsNotNull
     * @returns @type Criterion
     * @description 不等或不为空
     */
    static neOrIsNotNull( propertyName : string, value : any ) : Criterion{
        if( !value ){
            return Restrictions.isNotNull( propertyName );
        }
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.NE );
    }

    /**
     * @static @method not
     * @returns @type Criterion
     * @description not eq, not in, not between
     */
    static not( expression : Criterion ) : Criterion{
        return new NotExpression( expression )
    }

    /**
     * @static @method gt
     * @returns @type SimpleExpression
     * @description 字段属性值大于某个值
     */
    static gt( propertyName:string, value:any ) : SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.GT );
    }
    /**
     * @static @method ge
     * @returns @type SimpleExpression
     * @description 字段属性值大于等于某个值
     */
    static ge( propertyName:string, value:any ) : SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.GE );
    }

    /**
     * @static @method lt
     * @returns @type SimpleExpression
     * @description 字段属性值小于某个值
     */
    static lt( propertyName:string, value:any ) : SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.LT );
    }
    /**
     * @static @method le
     * @returns @type SimpleExpression
     * @description 字段属性值小于等于某个值
     */
    static le( propertyName:string, value:any ) : SimpleExpression{
        return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.LE);
    }

    /**
     * @static @method isNull
     * @returns @type Criterion
     * @description 某个字段属性为空 undefined null
     */
    static isNull( propertyName:string ) : Criterion{
        return new EmptyExpression( propertyName );
    }
    /**
     * @static @method isNotNull
     * @returns @type Criterion
     * @description 某个字段属性不为空
     */
    static isNotNull( propertyName:string ) : Criterion{
        return new NotEmptyExpression( propertyName );
    }

    /**
     * @static @method isEmpty
     * @returns @type Criterion
     * @description 某个字段值为空 空字符串
     */
    static isEmpty( propertyName:string ) : Criterion{
        return new EmptyExpression( propertyName );
    }
    static isNotEmpty( propertyName:string ) : Criterion{
        return new NotEmptyExpression( propertyName );
    }

    
    /**
     * @description 默认使用like方式
     */
    static like( propertyName : string, value:any ) : SimpleExpression;
    /**
     * @description 根据传入的类型进行字符串转换
     */
    static like( propertyName : string, value:string, matchMode: MatchMode ) : SimpleExpression;
    /**
     * @static @method like
     * @param propertyName @type string
     * @param prototype @type any
     * @param matchMode @type MatchMode
     * @returns @type SimpleExpression
     * @description 对某个属性值进行匹配
     */
    static like( propertyName : string, value:any|string, matchMode? : MatchMode ) : SimpleExpression{
        if( typeof matchMode === 'undefined' ){
            return new SimpleExpression( propertyName, value, SimpleExpression.OperatorType.LIKE );
        }
        return new SimpleExpression( propertyName, MatchMode.toMatchModeString(value, matchMode), SimpleExpression.OperatorType.LIKE );
    }

    /**
     * @description 忽略大小写的匹配
     */
    static ilike(propertyName:string, value:any) : Criterion;
    static ilike(propertyName:string, value:string, matchMode?:MatchMode) : Criterion;
    /**
     * @static @method ilike
     * @param propertyName  @type string
     * @param value @type any
     * @param matchMode @type MatchMode
     * @returns @type Criterion
     */
    static ilike(propertyName:string, value:any|string, matchMode?:MatchMode) : Criterion {
        if( typeof matchMode === 'undefined' )
            return Restrictions.ilike(propertyName, value, MatchMode.EXACT);
        return new LikeExpression(propertyName, value, true, matchMode);
    }

    
    /**
     * @param lhs @type Criterion
     * @param rhs @type Criterion
     * @returns LogicalExpression
     * @description 合并两个查询条件
     */
    static and( lhs : Criterion, rhs : Criterion ) : LogicalExpression;
    /**
     * @param criterions @type Criterion[]
     * @returns ConJunction
     * @description 合并多个查询条件
     */
    static and( ...criterions : Criterion[] ) : ConJunction;
    /**
     * @static @method and
     * @description 合并多个查询条件，根据参数的类型返回逻辑表达式或者连接点
     */
    static and( lhs : Criterion, rhs : Criterion ) : LogicalExpression | ConJunction {
        if( Array.isArray( lhs ) ){
            let conJunction : ConJunction = new ConJunction();
            for(let predicate of lhs){
                conJunction.add( predicate );
            }
            return conJunction;
        }else{
            return new LogicalExpression(lhs, rhs, Junction.Nature.AND);
        }
    }
    /**
     * @static @method conjunction
     * @returns @type ConJunction
     * @description 返回and的连接点
     */
    static conjunction() : ConJunction{
        return new ConJunction();
    }
    /**
     * @static @method disjunction
     * @returns @type DisJunction
     * @description 返回or的连接点
     */
    static disjunction() : DisJunction{
        return new DisJunction();
    }

    static or( lhs : Criterion, rhs : Criterion ) : LogicalExpression;
    static or( ...criterions : Criterion[] ) : DisJunction;
    static or( lhs : Criterion, rhs : Criterion ) : LogicalExpression | DisJunction {
        if( Array.isArray( lhs ) ){
            let disJunction : DisJunction = new DisJunction();
            for(let predicate of lhs){
                disJunction.add( predicate );
            }
            return disJunction;
        }else{
            return new LogicalExpression(lhs, rhs, Junction.Nature.OR);
        }
    }

    /**
     * @static @method in
     * @param propertyName @type string
     * @param values @type any[]
     * @returns @type Criterion
     * @description 某个字段属性值在一个集合内
     */
    static in( propertyName : string, values : any[] ) : Criterion {
        return new InExpression( propertyName, values );
    }

    /**
     * @static @method Between
     * @param propertyName @type string
     * @param leftValue @type any
     * @param rightValue @type any
     * @returns @type Criterion
     * @description 某个字段属性值处于两个区间[包含区间边界]
     */
    static between( propertyName:string, leftValue:any, rightValue:any ) : Criterion {
        return new BetweenExpression( propertyName, leftValue, rightValue );
    }

    /**
     * @description 对某个字段属性和另外某个字段属性关系
     */
    static eqProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.EQ);
    }
    static neProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.NE);
    }
    static gtProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.GT);
    }
    static ltProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.LT);
    }
    static geProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.GE);
    }
    static leProperty( propertyName:string, otherPropertyName:string ) : PropertyExpression{
        return new PropertyExpression( propertyName, otherPropertyName, SimpleExpression.OperatorType.LE);
    }

    /**
     * @static @method allEq
     * @param propertyNameValues    key[匹配的属性名]:value[匹配的属性值]
     * @returns @type Criterion
     * @description 对多个属性进行匹配
     */
    static allEq(propertyNameValues : { [key:string] : any} | Map<string, any> ) : Criterion{
        
        function isMap(propertyNameValues : any) : propertyNameValues is Map<string, any>{
            let hasSet = typeof propertyNameValues.set === 'function';
            let hasGet = typeof propertyNameValues.get === 'function'
            let hasDelete = typeof propertyNameValues.delete === 'function'
            let hasSize = 'size' in propertyNameValues;

            return hasSet && hasGet && hasDelete && hasSize;
        }

        let conjunction : ConJunction = new ConJunction;    // and 连接点

        if( isMap( propertyNameValues ) ){  // Map
            for( let [key, value] of propertyNameValues ){
                conjunction.add( Restrictions.eq( key, value ) );
            }
            
        }else{  // 普通键值对[原生Object对象]
            let keys = Object.getOwnPropertyNames( propertyNameValues ), hasOwn = Object.prototype.hasOwnProperty;

            for( let key of keys ){
                if( hasOwn.call( propertyNameValues, key ) ){
                    conjunction.add( Restrictions.eq( key, propertyNameValues[ key ] ) );
                }
            }
        }

        return conjunction;
    }
}
