import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable, Injector, SkipSelf, forwardRef, Inject } from "@angular/core";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { Criteria, CriteriaImpl } from "../criterion/index";

import { RequestCondition } from "../criterion/index";


@Injectable()
export class CriteriaHttp{
    private method : HttpMethod;
    private http : Http;
    private url : string;
    private entity : string | Function;
    private criteria : Criteria;

    constructor(http:Http, injector:Injector, 
        // @SkipSelf() self:CriterionHttp
        // @Inject( forwardRef(()=>CriterionHttp)) self:CriterionHttp 
        ){
        this.http = http;
        CriteriaHttp.injector = injector;
    }

    private static injector : Injector;

    static createCriteria(entity : string | Function, url:string, pagination:boolean=false, 
        method:HttpMethod=HttpMethod.POST) : Criteria{

        if( !url || !entity ) throw new Error("url and entity must already exist");

        var instance = CriteriaHttp.injector.get( CriteriaHttp );
        instance.url = url;
        instance.entity = entity;
        instance.criteria = new CriteriaImpl( pagination, entity, instance );
        instance.method = method;

        return instance.criteria;
    }


    getRemoteWithGet(condition : RequestCondition){
        return this.http.get(this.url).map(response=>response.json());
    }

    /**
     * @description 经测试不支持文件后缀，请求头部分已经携带
     */
    getRemoteWithPost( condition : RequestCondition ){
        let body = JSON.stringify(condition);
        let headers = new Headers({
            'Content-Type' : 'application/json'
        });
        let requestOptions = new RequestOptions({headers});

        return this.http.post( this.url, body, requestOptions ).map(response=>response.json());
    }
}

export enum HttpMethod{
    GET, POST
}