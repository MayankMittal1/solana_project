import {IntellectualProperty} from "./index"
export function makeid(length:number):string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
export function underscoreGenerator(length:number):string {
    var result           = '';
    var characters       = '_';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export function stringConcat(input:string,length:number):string {
    var u=length-input.length
    return input+underscoreGenerator(u)
}
export function stringParser(input:string):string {
    var length=input.length
    for(var i=length-1;i>=0;i--){
        if(input.charAt(i)!="_"){
            break
        }
    }
    return input.slice(0,i+1)
}

export function parseIntellectualProperty(property:IntellectualProperty):IntellectualProperty {
    property.uri=stringParser(property.uri)
    property.value=stringParser(property.value)
    return property
}
