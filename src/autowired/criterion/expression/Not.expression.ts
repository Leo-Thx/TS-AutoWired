import { Criterion } from "../Criterion.interface";

export class NotExpression implements Criterion{
    constructor(protected expression : Criterion){}
}