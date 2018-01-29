## TS-AutoWired
自己在学Angular的时候，用json文件模拟的数据的时候，发现只能bean.attr的方式获取，无法调取前端实体Bean的方法。虽然有些bug，但是按照自己的想法，做了一个符合自己Demo的自动装配实体的功能

#### 存在的问题和未完成[由于自己知识面太窄和技术能力的问题，导致部分功能无法完成]
* 由于Reflect-meta无法获取泛型的问题，在使用数组的时候，需要显示指明是哪种实体类型
* 由于JavaScript的对象的属性是动态的，不能像Java的@Entity一样，使用Reflect机制获取其存在的属性，故多使用一个Attribute装饰器
* 对于继承的情况，和上述原因一致，也需要显示指定extend
* 对于@Entity存在别名的情况暂时没有处理
* 对于VO类型的实体，没有做到提前载入，为了快速完成我自己的Demo，采用直接输出的办法，让其引入
* 对于JavaScript基础类型的数据直接转换为对象，没有进行可以字面量表示的判定，基础类型全部转换为对应的对象形式
* 对于实体引入自己的情况，在EntityDecoratorAnalyse做装配的时候，没有进行二次属性装饰器元数据的分析
* 没有整合Jasmin等好的测试工具，可能会导致功能有缺陷[只是为了自己的Demo]
* 其他遗留问题和不足会在下面说明

整个分为三个模块：HTTP，Decorator，Criterion

Decorator：保护装饰器元数据的定义，元数据结构定义，元数据分析器

Criterion: 借鉴Hibernate的QBC API转换而来`没有处理分组`，主要处理查询条件，含Expression、Projection、Junction、Order，具体在[设计图](https://github.com/Summeryicecream/TS-AutoWired/tree/master/design)中

HTTP ： 没有做成HTTP的适配形式，完全取用Angular HttpModule模块，对于POST没有做测试，在数据提交到后台时，会添加过滤条件

Example
```javascript
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
```
```javascript
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
```
```javascript
  // [app.component.ts]()
  testFilter(){
      let criteria : Criteria =  CriteriaHttp.createCriteria("admin", "autowired/test/repository/admin.json");
      // criteria.add( Restrictions.eq("password", "admin") )
      // criteria.add( Restrictions.gt('age', 12) );
      // .add( Restrictions.like('likeProp1', 'like1') )
      // .add( Restrictions.like('likeProp1', 'like2', MatchMode.START))

      // criteria.add( Restrictions.isNotEmpty('empty') )
      // .add( Restrictions.isNotNull('isNotNull') )

      // criteria.add( Restrictions.between("age", "13", "15") );

      // criteria.add( Restrictions.in('age', [13, 14, 15]) );

      // criteria.add( Restrictions.ilike('username', 'admin') );
      // criteria.add( Restrictions.ilike('username', 'admin', MatchMode.START) );

      // criteria.add( Restrictions.and(Restrictions.eq("password", "admin"), Restrictions.in('age', [12, 13, 14, 15])) );

      // criteria.add( Restrictions.eqProperty("username", 'password') );

      // criteria.setProjection( Projections.max("age") );
      // let projectionList = Projections.projectionList();
      // projectionList.add( Projections.max("age") ).add( Projections.avg('age') );
      // criteria.setProjection( projectionList );

      // criteria.addOrder( Order.desc('age') );  //升序排列

      let example = Example.create({
          username : 'admin',
          // age : 12
      });

      // example.excludeProperty("province");
      // example.enableLike();
      example.ignoreCase();

      criteria.add(example);

      criteria.list().subscribe(response=>{
          console.info(response);
      });
    }
```
在进行查询时，会构造请求头
```javascript
    Aggregation:    聚合函数
        max : [propertyName]
        min : [propertyName]
        count : [propertyName]
        sum : [propertyName]
        avg : [propertyName]
    RowCount : 行统计
        rowCount : boolean
    Group : 分组
        group : [propertyName]
    Order : 排序
        order : [{ propertyName : string, type : string }, ...]
    Pagination : 分页
        firstResult : number
        maxResults : number
    Property : 字段属性比较
        propertyName : [{type : eq/ne/gt/ge/lt/le/between/in/like.., value: any, matchMode:EXACT/ANYWHERE/START/END}]
        propertyName : { eq/ne/gt/ge/lt/le/between/in/like.. : { value: any, matchMode:EXACT/ANYWHERE/START/END } }   
        [{
            propertyName : string,
            operator : [{
                name : eq/ne/gt/ge/lt/le/between/in/like... 
                value : any | any[] | { min:any, max:any },
                matchMode : matchMode:EXACT/ANYWHERE/START/END,
                ignoreCase : boolean, 
                isOtherPro : boolean
            }]
        }]
    Example : {
        entity : {} // 匹配的键值对
        excludedProperties : [] // 排除的字段
        ignoreCase : boolean // 是否忽略大小写
        isLike : boolean // 是否使用like
        matchMode : string // 匹配的模式
    }    
    And|or : [{ // unused
        propertyName : string,
            operator : [{
                name : eq/ne/gt/ge/lt/le/between/in/like... 
                value : any | any[] | { min:any, max:any },
                matchMode : matchMode:EXACT/ANYWHERE/START/END,
                ignoreCase : boolean, 
                isOtherPro : boolean
            }]
    }]
    // and or 操作
```
过滤后的数据记录结构
```javascript
    sturct : {
        originRecords : data,
        records : data,
        totals : 100,
        pageSize : 10,
        pageNum : 1
    
        Aggregation: {  聚合函数
            max : [{propertyName : name, value : string}]
            min : ..
            count ..
            sum : ..
            avg : ..
        }
        RowCount : {    行统计
            rowCount : boolean,
            value : number
        }
        Group : 分组
            group : [propertyName]
        Order : 排序
            order : [{ propertyName : string, type:string }, ...]
        Pagination : 分页
            firstResult : number
            maxResults : number
        Property : 字段属性比较
            [{
                propertyName : string,
                type : [{
                    name : eq/ne/gt/ge/lt/le/between/in/like...
                    value : any | any[] | { min:any, max:any },
                    matchMode : matchMode:EXACT/ANYWHERE/START/END
                }]
            }]  
        Example : {
            entity : {} // 匹配的键值对
            excludedProperties : [] // 排除的字段
            ignoreCase : boolean // 是否忽略大小写
            isLike : boolean // 是否使用like
            matchMode : string // 匹配的模式
        }    
        // and or 操作
     }
```

模拟数据
```json
[{
    "id" : "12345",
    "name" : "管理员",
    "age" : "12",
    "phone" : "13201093733",
    "address" : {
        "province" : "广东省",
        "city" : "深圳市",
        "detail" : "龙华某个地方"
    },
    "testArray" : ["str1", "str2"],
    "testAddressArr" : [
        {
            "province" : "广东省1",
            "city" : "深圳市1",
            "detail" : "龙华某个地方1"
        },{
            "province" : "广东省2",
            "city" : "深圳市2",
            "detail" : "龙华某个地方2"
        }
    ],
    "testUserArr" : [
        {
            "id" : "1232",
            "name" : "呵呵用户",
            "age" : "15",
            "phone" : "13201093733",
            "address" : {
                "province" : "广东省",
                "city" : "深圳市",
                "detail" : "龙华某个地方"
            },
            "username" : "user用户",
            "password" : "userpassword"
        }
    ],
    "username" : "admin",
    "password" : "admin"
},{
    "id" : "12342",
    "name" : "不知道的管理员",
    "age" : "18",
    "phone" : "13201093733",
    "address" : {
        "province" : "广东省",
        "city" : "深圳市",
        "detail" : "龙华某个地方"
    },
    "username" : "Admin",
    "password" : "123"
}, {
    "id" : "1232",
    "name" : "呵呵管理员",
    "age" : "15",
    "phone" : "13201093733",
    "address" : {
        "province" : "广东省",
        "city" : "深圳市",
        "detail" : "龙华某个地方"
    },
    "username" : "hehe",
    "password" : "admin"
}]
```
测试结果：
![result](https://github.com/Summeryicecream/TS-AutoWired/blob/master/testResult.png)
