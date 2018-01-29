import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";

import { DecoratorTest } from "./decorator.test"
import { ExpressionCriterionTest } from "./criterion.expression.test";

import { ProjectionTest } from "./criterion.projection";

import { ExampleTest } from "./criterion.example.test";

import { CriteriaHttp } from "../http/CriteriaHttp";

@NgModule({
    imports : [HttpModule],
    declarations : [],
    exports : [ HttpModule ],
    providers : [ 
        // DecoratorTest, 
        ExpressionCriterionTest, ProjectionTest, ExampleTest, CriteriaHttp ]
})
export class TestModule{

}