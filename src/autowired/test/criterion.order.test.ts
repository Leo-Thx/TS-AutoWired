import { Order, Restrictions, IRequestCondition, RequestCondition } from "../criterion/index";

import { Injectable } from "@angular/core";


@Injectable()
export class OrderTest{
    private requestCondition : RequestCondition;
    constructor(){
        this.requestCondition = new RequestCondition();
    }

    testOrder(){
        
    }
}