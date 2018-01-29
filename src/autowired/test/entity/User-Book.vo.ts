// 不采用外键关联，采用实体进行关联
import { Book } from "./Book.vo";
import { User } from "./User.vo";

import { VoUtil } from "./Vo.util";

export class UserBook{
    readonly id : string;
    private book:Book[];
    private user:User;

    constructor(book:Book[] = [] as Array<Book>, user:User){
        this.book = book;
        this.user = user;
        this.id = VoUtil.getVoId();
    }
}