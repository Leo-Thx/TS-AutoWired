import { Component } from '@angular/core';

import * as _ from "lodash";
// import { LikeExpression } from "./criterion/expression/Like.expression";
// import { MatchMode } from "./criterion/MatchMode";


import { DecoratorTest } from "./test/decorator.test";
import { ExpressionCriterionTest } from "./test/criterion.expression.test";
import { ProjectionTest } from "./test/criterion.projection";
import { ExampleTest } from "./test/criterion.example.test";

import { CriteriaHttp } from "./http/CriteriaHttp";

import {Attribute, Entity, DecoratorManager, EntityDecoratorAnalyse, AttributeDecoratorAnalyse} from "./decorator/index";

import { Criteria, Restrictions, MatchMode, Projections, Order, Example } from "./criterion/index";

import { Person } from "./test/entity/Person.vo";
import { Address } from "./test/entity/Address.vo";
import { User } from "./test/entity/User.vo";
import { AdminVo } from "./test/entity/Admin.vo";


@Component({
  selector: 'my-app',
  template: `<h1>{{name}}</h1>`
})
export class AppComponent  { 
  name = 'AutoWired';

  private criteriaHttp : CriteriaHttp;
  private decoratorTest : DecoratorTest;
  private expressionTest : ExpressionCriterionTest;
  private projectionTest : ProjectionTest;
  private exampleTest : ExampleTest;

  private entityDecoratorAnalyse : EntityDecoratorAnalyse;
  private attributeDecoratorAnalyse : AttributeDecoratorAnalyse;

  // constructor( decoratorTest : DecoratorTest, expressionText : ExpressionCriterionTest,
  constructor( expressionText : ExpressionCriterionTest,
    ProjectionTest : ProjectionTest, exampleTest:ExampleTest, criteriaHttp : CriteriaHttp ){
  
    console.info(Address.name, Person.name, AdminVo.name, User.name);

    this.entityDecoratorAnalyse = <EntityDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( EntityDecoratorAnalyse.DECORATOR_NAME );
    this.attributeDecoratorAnalyse = <AttributeDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( AttributeDecoratorAnalyse.DECORATOR_NAME );

    // this.decoratorTest = decoratorTest;
    this.expressionTest = expressionText;
    this.projectionTest = ProjectionTest;
    this.exampleTest = exampleTest;
    // this.criteriaHttp = criteriaHttp;

    this.test();
  }

  test(){
    // this.testDecorator();
    // this.testExpression();
    // this.testProjection();
    // this.testExample();

    // this.testHttp();
    this.testFilter();
  }

  testDecorator(){
    console.info( "************* EntityDecoratorAnalyse start **************" );
    // console.info(this.entityDecoratorAnalyse);

    let classToEntity = this.entityDecoratorAnalyse.getMetaMap( EntityDecoratorAnalyse.CLASSTOENTITY_MAP_NAME );
    console.info(classToEntity);

    let nameToClass = this.entityDecoratorAnalyse.getMetaMap( EntityDecoratorAnalyse.CLASSNAMETOCLASS_MAP_NAME );
    console.info( nameToClass );

    console.info( "************* EntityDecoratorAnalyse end **************" );
  }

  testExpression(){
    // this.expressionTest.testBetweenExpression();
    // this.expressionTest.testEmptyExpression();
    // this.expressionTest.testInExpression();
    // this.expressionTest.testLikeExpression();
    // this.expressionTest.testILikeExpression();
    // this.expressionTest.testPropertyExpression();
    // this.expressionTest.testSimpleExpression();
    // this.expressionTest.testLogicalExpression();
  }

  testProjection(){
    // this.projectionTest.testAvgProjection();
    // this.projectionTest.testCountProjection();
    // this.projectionTest.testProperty();
    // this.projectionTest.testRowCount();
    // this.projectionTest.testProjectionList();
  }

  testExample(){
    this.exampleTest.testExample();
  }

  testHttp(){
    let criteria : Criteria =  CriteriaHttp.createCriteria("admin", "autowired/test/repository/admin.json");    
    criteria.list().subscribe(response=>{
        console.info(response);
    });
  }

  testFilter(){
    let criteria : Criteria =  CriteriaHttp.createCriteria("admin", "autowired/test/repository/admin.json");
    // criteria.add( Restrictions.eq("password", "admin") )
    // criteria.add( Restrictions.gt('age', 12) );
    // .add( Restrictions.like('likeProp1', 'like1') )
    // .add( Restrictions.like('likeProp1', 'like2', MatchMode.START))
    
    // criteria.add( Restrictions.isNotEmpty('empty') )
    // .add( Restrictions.isNotNull('isNotNull') )

    // criteria.add( Restrictions.between("age", "13", "15") );
    
    // criteria.add( Restrictions.in('age', [13, 14, 15]) );

    // criteria.add( Restrictions.ilike('username', 'admin') );
    // criteria.add( Restrictions.ilike('username', 'admin', MatchMode.START) );

    // criteria.add( Restrictions.and(Restrictions.eq("password", "admin"), Restrictions.in('age', [12, 13, 14, 15])) );

    // criteria.add( Restrictions.eqProperty("username", 'password') );

    // criteria.setProjection( Projections.max("age") );
    // let projectionList = Projections.projectionList();
    // projectionList.add( Projections.max("age") ).add( Projections.avg('age') );
    // criteria.setProjection( projectionList );


    // criteria.addOrder( Order.desc('age') );  //升序排列


    let example = Example.create({
        username : 'admin',
        // age : 12
    });
    
    // example.excludeProperty("province");
    // example.enableLike();
    example.ignoreCase();

    criteria.add(example);

    criteria.list().subscribe(response=>{
        console.info(response);
    });



  }

}

