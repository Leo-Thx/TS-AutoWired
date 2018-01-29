import { Injectable } from "@angular/core";


import {Attribute, Entity, DecoratorManager, EntityDecoratorAnalyse, AttributeDecoratorAnalyse} from "../decorator/index";


@Entity({
  name : 'addressTest'
})
class AddressTest{
  @Attribute({
    name : 'province',
    alias : 'privateAlias',
    type : 'string'
  })
  private province : string;
  
  @Attribute()
  private city : string;
}

@Entity
class PersonTest{
  @Attribute()
  private name : string;
  
  @Attribute()
  private age : number;
  
  @Attribute()
  // @Attribute({
  //   type : 'class',
  //   relatedEntity : 'addressTest'
  // })
  private address : AddressTest;
  
  @Attribute({
    type : 'array',
    relatedEntity : 'addressTest'
  })
  private addressArray : Array<AddressTest>;

  @Attribute({
    type : 'array',
    relatedEntity : 'number'
  })
  private numbers : number[]

  @Attribute()
  private birthdy : Date;
  
  @Attribute()
  private regexp : RegExp;
}


@Injectable()
export class DecoratorTest{
  private entityDecoratorAnalyse : EntityDecoratorAnalyse;
  private attributeDecoratorAnalyse : AttributeDecoratorAnalyse;
  constructor(){
    this.entityDecoratorAnalyse = <EntityDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( EntityDecoratorAnalyse.DECORATOR_NAME );
    this.attributeDecoratorAnalyse = <AttributeDecoratorAnalyse>DecoratorManager.getDecoratorAnalyse( AttributeDecoratorAnalyse.DECORATOR_NAME );

    // this.printEntityMap();

    // this.printAttributeMap();
  }
  
  printEntityMap(){
    console.info( "************* EntityDecoratorAnalyse start **************" );
    console.info(this.entityDecoratorAnalyse);
    let classToEntity = this.entityDecoratorAnalyse.getMetaMap( EntityDecoratorAnalyse.CLASSTOENTITY_MAP_NAME );
    console.info(classToEntity);
    let nameToClass = this.entityDecoratorAnalyse.getMetaMap( EntityDecoratorAnalyse.CLASSNAMETOCLASS_MAP_NAME );
    console.info( nameToClass );
    console.info( "************* EntityDecoratorAnalyse end **************" );
  }

  printAttributeMap(){
    console.info( "************* AttributeDecoratorAnalyse start **************" );
    console.info( this.attributeDecoratorAnalyse );
    let classToAttributes = this.attributeDecoratorAnalyse.getMetaMap( AttributeDecoratorAnalyse.CLASSTOATTRIBUTES_MAP_NAME );
    console.info( classToAttributes );
    console.info( "************* AttributeDecoratorAnalyse end **************" );
  }
}