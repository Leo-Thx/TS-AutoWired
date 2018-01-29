import { Junction } from "./Junction.criterion";

export class DisJunction extends Junction{
    constructor(){
        super( Junction.Nature.OR );
    }
    getNature() : Junction.Nature{ 
        return Junction.Nature.OR;
    }
}
