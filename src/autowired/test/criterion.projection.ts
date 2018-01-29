import {  IRequestCondition, RequestCondition, Projections, RowCountProjection, ProjectionList } from "../criterion/index";

import { Injectable } from "@angular/core";


@Injectable()
export class ProjectionTest{
    private requestCondition : RequestCondition;
    constructor(){
        this.requestCondition = new RequestCondition();
    }

    testAvgProjection(){
        let criterion = Projections.avg("avg1");
        console.info( criterion );

        criterion.buildRequestCondition( this.requestCondition );

        criterion = Projections.avg("avg2");
        criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }

    testCountProjection(){
        let criterion = Projections.count("count1");
        // console.info( criterion );
        criterion.buildRequestCondition( this.requestCondition );

        criterion = Projections.count("count2");
        criterion.buildRequestCondition( this.requestCondition );

        console.info( this.requestCondition );
    }

    testMaxProjection(){}

    testMinProjection(){}

    testSumProjection(){}

    testProjectionList(){
        let list : ProjectionList = Projections.projectionList();
        list.add( Projections.max("list-max") ).add( Projections.min('list-min') ).add( Projections.sum('list-sum')).add( Projections.avg('list-avg') );
        list.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }

    testProperty(){
        let criterion = Projections.groupProperty("propertyName");
        criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }

    testRowCount(){
        let criterion = <RowCountProjection>Projections.rowCount();
        criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }
}