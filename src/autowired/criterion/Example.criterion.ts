import { Criterion } from "./Criterion.interface";
import { MatchMode } from "./MatchMode";

import { IRequestCondition } from "./IRequestCondition";
import { RequestCondition } from "./RequestCondition";

import { FilteredRecords } from "./FilteredRecords";
import { IDataProcessor } from "./IDataProcessor";

import * as _ from "lodash";

interface PropertyMap{
    [key:string] : any
}

/**
 * @class Example
 * @implements Criterion
 * @description 根据传入的键值对进行匹配[层级?]
 */
export class Example implements Criterion, IRequestCondition, IDataProcessor{

    private entity : PropertyMap;   // 键值对
    private excludedProperties : Set<string> = new Set(); // 排除的属性
    private isIgnoreCaseEnabled : boolean;

    private isLikeEnabled : boolean;
    private matchMode : string;
    private matchModeType : MatchMode;

    constructor( map : PropertyMap){
        this.entity = map;
    }

    static create( map : PropertyMap ) : Example{
        if( !map ) throw new Error('arguments is null');
        return new Example( map );
    }

    enableLike() : Example;
    enableLike(matchMode : MatchMode):Example;
    enableLike(matchMode? : MatchMode):Example{
        if( typeof matchMode === 'undefined' ){
            return this.enableLike( MatchMode.EXACT );
        }
        this.isLikeEnabled = true;
        this.matchModeType = matchMode;
        this.matchMode = MatchMode[ matchMode ];
        return this;
    }

    // 排除某些字段
    // excludeNone():Example{ return null;}
    excludeProperty(propertyName:string) : Example{
        this.excludedProperties.add( propertyName );
        return this;
    }

    isPropertyIncluded(propertyName:string) : boolean{
        return this.excludedProperties.has( propertyName );
    }

    ignoreCase():Example{
        this.isIgnoreCaseEnabled = true;
        return this;
    }

    /**
     * @override
     */
    buildRequestCondition( condition : RequestCondition ) : RequestCondition{
        var propertys = [];
        for(let prop of this.excludedProperties.values()){
            propertys.push( prop );
        }

        condition.addExampleProperty({
            entity : this.entity,
            excludedProperties : propertys,
            ignoreCase : this.isIgnoreCaseEnabled,
            isLike : this.isLikeEnabled,
            matchMode : this.matchMode
        });

        return condition;
    }


    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let originRecords = filteredRecords.records;

        let keys : string[] = [];
        for(let key of Object.keys( this.entity ) ){
            if( !this.excludedProperties.has( key ) ){
                keys.push( key );
            }
        }

        let records : any = [];
        _.forEach(originRecords, record=>{
            let isMatch = true;
            _.forEach(keys, key=>{
                let regExp;

                if( this.isLikeEnabled ){
                    regExp = MatchMode.toMatchModeString(this.entity[ key ], this.matchModeType);
                }

                if( this.isIgnoreCaseEnabled ){
                    regExp = MatchMode.toMatchModeIngnoreString(this.entity[ key ], _.isUndefined(this.matchModeType) ? MatchMode.EXACT : this.matchModeType);
                }

                isMatch = regExp ? regExp.test( record[ key ] ) : this.entity[ key ] == record[ key ]
            });
            if( isMatch ){
                records.push( record );
            }
        });

        filteredRecords.records = records;
        return filteredRecords;
    }
}