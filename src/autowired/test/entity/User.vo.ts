import { Entity, Attribute } from "../../decorator/index";

import { Person, PersonPropertyType } from "./Person.vo";
import { Book } from "./Book.vo"
import { Address } from "./Address.vo";
import { UserBook } from "./User-Book.vo";

type UserType = PersonPropertyType | "username" | "password";


@Entity({
    name : 'User',
    extend : 'Person'
})
export class User extends Person{
    @Attribute() username:string;
    @Attribute() password : string;
    
    userBook : UserBook;

    constructor(id:string, name:string, age:number, phone:string);
    constructor(id:string, name:string, age:number, username?:string, password?:string);
    constructor(id:string, name:string, age:number, phone:string, username?:string, password?:string, address?:Address){
        super( id, name, age, phone, address );
        this.username = username || this.name;
        this.password = password || this.name;
    }
    getValue(property:UserType){
        return this[ property ];
    }
    setValue(p:UserType, val:any){
        this[ p ] = val;
    }
}