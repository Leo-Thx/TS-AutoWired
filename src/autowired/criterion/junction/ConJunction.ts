import { Junction } from "./Junction.criterion";

export class ConJunction extends Junction{
    constructor(){
        super( Junction.Nature.AND );
    }
    getNature() : Junction.Nature{ 
        return Junction.Nature.AND;
    }
}
