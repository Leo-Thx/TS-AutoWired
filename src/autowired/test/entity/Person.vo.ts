import { Entity, Attribute } from "../../decorator/index";

import { Address } from "./Address.vo";

import { VoUtil } from "./Vo.util";

export type PersonPropertyType = "name" | "age" | "phone" | "address";


@Entity
export abstract class Person{
    @Attribute() readonly id : string;
    @Attribute() name : string;
    @Attribute() age : number;
    @Attribute() phone : string;
    @Attribute({
        type : 'class',
        relatedEntity : 'Address'
    })
    address : Address;

    constructor();
    constructor(id:string, name:string, age:number, phone:string, address:Address);
    constructor(id?:string, name?:string, age?:number, phone?:string, address:Address = {} as Address){
        this.id = id || VoUtil.getVoId();
        this.name = name;
        this.age = age;
        this.phone = phone;
        this.address = address;
    }
    
    abstract getValue(property:PersonPropertyType) : void;
    abstract setValue(p:PersonPropertyType, val:any) : void;
}