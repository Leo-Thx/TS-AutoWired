export enum MatchMode{
    EXACT, // MatchMode.EXACT --> 字符串精确匹配.相当于"like 'value'"
    ANYWHERE, // MatchMode.ANYWHERE --> 字符串在中间匹配.相当于"like '%value%'"
    START, // MatchMode.START --> 字符串在最前面的位置.相当于"like 'value%'"
    END // MatchMode.END --> 字符串在最后面的位置.相当于"like '%value'"
}

export namespace MatchMode{
    export function toMatchModeString(value : string, matchMode : MatchMode) : RegExp{
        if( matchMode === MatchMode.EXACT ){
            return new RegExp( "^"+value+"$" ); // /^value$/
        }
        if( matchMode === MatchMode.ANYWHERE ){
            return new RegExp(".?"+ value +".?");   // /.*value.*/
        }
        if( matchMode === MatchMode.START ){
            return new RegExp( "^"+ value +".?" );  // /^value.*
        }
        if( matchMode === MatchMode.END ){
            return new RegExp( ".?" + value + "$" );
        }
    }

    export function toMatchModeIngnoreString(value : string, matchMode : MatchMode) : RegExp{
        if( matchMode === MatchMode.EXACT ){
            return new RegExp( "^"+value+"$", "i"); // /^value$/
        }
        if( matchMode === MatchMode.ANYWHERE ){
            return new RegExp(".?"+ value +".?", "i");   // /.*value.*/
        }
        if( matchMode === MatchMode.START ){
            return new RegExp( "^"+ value +".?", "i");  // /^value.*
        }
        if( matchMode === MatchMode.END ){
            return new RegExp( ".?" + value + "$", "i");
        }
    }
}