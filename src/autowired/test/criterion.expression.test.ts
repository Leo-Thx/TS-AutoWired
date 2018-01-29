import { Restrictions, 
    AbstractEmptinessExpression, 
    BetweenExpression,
    EmptyExpression,
    InExpression,
    LikeExpression,
    LogicalExpression,
    NotExpression,
    NotEmptyExpression,
    PropertyExpression,
    SimpleExpression,
    RequestCondition,
    IRequestCondition,
    MatchMode
} from "../criterion/index";

import { Injectable } from "@angular/core";


@Injectable()
export class ExpressionCriterionTest{
    private requestCondition : RequestCondition;
    constructor(){
        this.requestCondition = new RequestCondition();
    }

    testBetweenExpression(){
        let criterion = <IRequestCondition>Restrictions.between("between", "leftValue", "rightValue");
        console.info( criterion );
        criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }
    testEmptyExpression(){
        let criterion = <IRequestCondition>Restrictions.isNull("isNull");
        criterion.buildRequestCondition( this.requestCondition )
        console.info( criterion );

        criterion = <IRequestCondition>Restrictions.isEmpty("isEmpty");
        criterion.buildRequestCondition( this.requestCondition )
        console.info( criterion );

        // criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }
    testInExpression(){
        let criterion = <IRequestCondition>Restrictions.in("in", ["value1", "value2"]);
        console.info(criterion);
        criterion.buildRequestCondition( this.requestCondition )
        console.info( this.requestCondition );
    }
    testLikeExpression(){
        let criterion = <IRequestCondition>Restrictions.like("like", "likeValue", MatchMode.EXACT);
        console.info(criterion);
        criterion.buildRequestCondition( this.requestCondition )
        console.info( this.requestCondition );
    }

    testILikeExpression(){
        let criterion = <IRequestCondition>Restrictions.ilike('ilike', "ilike", MatchMode.START);
        console.info(criterion);
        criterion.buildRequestCondition( this.requestCondition )
        console.info( this.requestCondition );
    }
    testLogicalExpression(){}
    // testNotExpression(){}
    // testNotEmptyExpression(){}
    testPropertyExpression(){}
    testSimpleExpression(){
        let criterion = <IRequestCondition>Restrictions.eq("eq", "eqValue");
        criterion.buildRequestCondition( this.requestCondition );

        criterion = <IRequestCondition>Restrictions.ne("ne", "neValue");
        criterion.buildRequestCondition( this.requestCondition );

        criterion = <IRequestCondition>Restrictions.eqProperty("eqProperty", "otherPropertyName");
        criterion.buildRequestCondition( this.requestCondition );

        criterion = <IRequestCondition>Restrictions.allEq({
            key1 : 'value1',
            key2 : 'value2'
        });
        criterion.buildRequestCondition( this.requestCondition );

        console.info( this.requestCondition );
    }
}