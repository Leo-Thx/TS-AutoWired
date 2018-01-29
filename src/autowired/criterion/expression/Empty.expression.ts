import { AbstractEmptinessExpression } from "./AbstractEmptiness.expression";


export class EmptyExpression extends AbstractEmptinessExpression{
    constructor(proName:string){
        super( proName );
    }

    protected excludeEmpty() : boolean{ return false; }
}