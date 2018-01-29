import { AbstractMeta } from "./Abstract.meta";

export interface EntityMeta extends AbstractMeta{
    name? : string;
    isWiredAll? : boolean;
    extend? : string | Function;
    constructor? : Function
}