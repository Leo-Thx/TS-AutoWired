import { Entity, Attribute } from "../../decorator/index";

@Entity
export class Address{
    @Attribute() province : string;
    @Attribute() city : string;
    @Attribute() detail : string;
    
    constructor(province:string, city:string, detail?:string){
        this.province = province;
        this.city = city;
        this.detail = detail;
    }
}