import { Projection } from "./Projection.interface";

import { RequestCondition } from "../RequestCondition";
import { IRequestCondition } from "../IRequestCondition";

import { FilteredRecords } from "../FilteredRecords";
import { IDataProcessor } from "../IDataProcessor";

import { SimpleProjection } from "./SimpleProjection.projection";

/**
 * @class ProjectionList
 * @description 多个Projection的链式混合
 * @extends Projection
 */
export class ProjectionList extends Projection implements IRequestCondition, IDataProcessor{
    /**
     * @property elements
     * @description Projection数组, 用来存储多个Projection
     */
    private  elements : Array<Projection>  = new Array();

    public constructor(){
        super();
    }

    /**
     * @method add
     * @param projection @type Projection 
     * @description 添加一个新的投影关系
     * @returns ProjectionList
     */
    add( projection : Projection ) : ProjectionList{
        this.elements.push( projection );
        return this;
    }

    /**
     * @method create
     * @description 从当前实例上，创建新ProjectionList实例
     * @returns ProjectionList
     */
    create() : ProjectionList{ 
        return new ProjectionList();
    }
    /**
     * @method getProjection
     * @param index @type number
     * @returns Projection
     * @description 根据索引获取当前Projection集合中的某个
     */
    getProjection(index : number) : Projection{ 
        return this.elements[ index ];
    }

    /**
     * @description 获取当前Projection集合长度
     */
    getLength() : number{ 
        return this.elements.length;
    }

    /**
     * @description 是否进行分组
     */
    isGrouped() : boolean {
        for( let project of this.elements ){
            if( project.isGrouped() ) return true;
        }
        return false;
    }
    
    /**
     * @override
     */
    buildRequestCondition( condition : RequestCondition ) : RequestCondition{
        let conditionInstance : IRequestCondition = null; 
        this.elements.forEach((projection, index)=>{
            conditionInstance = <SimpleProjection>this.elements[ index ];
            conditionInstance.buildRequestCondition( condition );
        });
        return condition;
    }

    /**
     * @override
     */
    dataProcessor( filteredRecords : FilteredRecords ) : FilteredRecords{
        let processorInstance : IDataProcessor = null; 
        this.elements.forEach((projection, index)=>{
            processorInstance = <SimpleProjection>this.elements[ index ];
            processorInstance.dataProcessor( filteredRecords );
        });
        return filteredRecords;
    }
}