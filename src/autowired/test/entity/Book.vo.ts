
import{ BookType } from "./BookType"
import { VoUtil } from "./Vo.util";

type BookPropertyType =  "isbn" | "name" | "price" | "author" | "page" | "stock" | "publishTime" | "type";

export class Book{
    isbn : string;
    name : string;  // 书名
    price : number; // 价格
    author : string;    // 作者
    page : number;  // 页数
    stock : number;
    publishTime : Date;     // 出版时间
    type : BookType = BookType.WOODFREE // 纸张类型
    
    constructor(name:string, price:number, author:string, page:number);
    constructor(name:string, price:number, author:string, page:number, stock:number);
    constructor(name:string, price:number, author:string, page:number, stock:number=20, type:BookType = BookType.WOODFREE, publishTime:Date = new Date()){
        this.isbn = VoUtil.getVoId();
        
        this.price = price;
        this.name = name;
        this.author = author;
        this.page = Number.parseFloat( page.toFixed(2) );
        
        this.stock = stock;
        this.type = type;
        this.publishTime = publishTime;
    }
    getValue(property:BookPropertyType){
        return this[ property ];
    }
    setValue(p:BookPropertyType, val:any){
        this[ p ] = val;
    }
}