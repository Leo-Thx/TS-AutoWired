import { EntityMeta } from "./meta/Entity.meta";
import { EntityDecoratorAnalyse } from "./metaAnalyse/EntityDecorator.analyse";
import { DecoratorManager } from "./DecoratorManager";


interface EntityDecorator{
    ( meta : EntityMeta ) : any;
    new ( meta : EntityMeta ) : EntityMeta;
}

const analyseInstance : EntityDecoratorAnalyse = <EntityDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( EntityDecoratorAnalyse.DECORATOR_NAME );

export const Entity : EntityDecorator = <EntityDecorator>analyseInstance.getDecorator();
