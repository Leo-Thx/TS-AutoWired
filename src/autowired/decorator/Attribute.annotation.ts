import { AttributeMeta } from "./meta/Attribute.meta";
import { AttributeDecoratorAnalyse } from "./metaAnalyse/AttributeDecorator.analyse";
import { DecoratorManager } from "./DecoratorManager";

interface AttributeDecorator{
    ( meta? : AttributeMeta ) : any;
    new ( meta? : AttributeMeta ) : AttributeMeta;
}

const analyseInstance : AttributeDecoratorAnalyse = <AttributeDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( AttributeDecoratorAnalyse.DECORATOR_NAME );

export const Attribute : AttributeDecorator = <AttributeDecorator>analyseInstance.getDecorator();

