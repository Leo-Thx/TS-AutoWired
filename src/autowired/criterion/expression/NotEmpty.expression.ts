import { AbstractEmptinessExpression } from "./AbstractEmptiness.expression";


export class NotEmptyExpression extends AbstractEmptinessExpression{
    constructor(proName:string){
        super( proName );
    }

    protected excludeEmpty() : boolean{ return true; }
}