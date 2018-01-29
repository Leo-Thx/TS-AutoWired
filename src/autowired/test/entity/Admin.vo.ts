import { Entity, Attribute } from "../../decorator/index";

import { Person, PersonPropertyType } from "./Person.vo";
import { Address } from "./Address.vo";
import { User } from "./User.vo";

type AdminType = PersonPropertyType | "username" | "password";


@Entity({
    name : 'admin',
    extend : 'Person'
})
export class AdminVo extends Person{
    @Attribute() username:string;
    @Attribute() password : string;
    @Attribute({
        type : 'array',
        relatedEntity : 'string'
    }) 
    testArray : string[];

    @Attribute({
        type : 'array',
        relatedEntity : 'Address'
    })
    testAddressArr:Address[];

    @Attribute({
        type : 'array',
        relatedEntity : 'User'
    })
    testUserArr : User[];

    constructor();
    constructor(id:string, name:string, age:number, phone:string, username:string, password:string);
    constructor(id?:string, name?:string, age?:number, phone?:string, username?:string, password?:string, address?:Address){
        super( id, name, age, phone, address );
        this.username = username;
        this.password = password;
    }
    getValue(property:AdminType){
        return this[ property ];
    }
    setValue(p:AdminType, val:any){
        this[ p ] = val;
    }
}