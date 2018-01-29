/**
 * 投影 聚合 分组
 * 投影是指取表的某些列的字段值
 * 聚合是指 对一组值执行计算并返回单一的值的函数 max, min, avg, count, sum...
 * 分组 对投影出的列或者聚合进行分组
 */
interface IProjection{}

/**
 * Expression部分实例会委托Projection完成
 * @description 投影 聚合 基类，由于js中接口无法进行成员的定义 故改为抽象类
 * @class @abstract  Projection
 * @implements IProjection
 */
export abstract class Projection implements IProjection{
    /**
     * @description 对返回的值是否进行分组
     * @method @abstract isGrouped
     * @returns boolean
     */
    abstract isGrouped() : boolean;
}