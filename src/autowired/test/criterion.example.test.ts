import { Order, Restrictions, IRequestCondition, RequestCondition, Example } from "../criterion/index";

import { Injectable } from "@angular/core";


@Injectable()
export class ExampleTest{
    private requestCondition : RequestCondition;
    constructor(){
        this.requestCondition = new RequestCondition();
    }

    testExample(){
        let criterion = Example.create({
            name : 'pro-name',
            age : 12
        });
        console.info( criterion );
        
        criterion.excludeProperty("province");
        criterion.enableLike();
        criterion.ignoreCase();

        criterion.buildRequestCondition( this.requestCondition );
        console.info( this.requestCondition );
    }
}